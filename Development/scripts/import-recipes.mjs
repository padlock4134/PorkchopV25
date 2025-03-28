import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import knex from 'knex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Initialize knex with better-sqlite3
const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: path.join(projectRoot, 'src', 'database', 'db.sqlite3')
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.pragma('foreign_keys = ON');
      cb();
    }
  }
});

async function ensureDirectoryExists(dir) {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function copyImages() {
  const sourceDir = path.join(projectRoot, 'data', 'images', 'Recipe Stock Photos');
  const targetDir = path.join(projectRoot, 'public', 'images', 'recipes');
  
  // Ensure target directory exists
  await ensureDirectoryExists(targetDir);
  
  // Get list of image files
  const files = await fs.promises.readdir(sourceDir);
  
  // Copy each image
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    await fs.promises.copyFile(sourcePath, targetPath);
    console.log(`Copied ${file} to public directory`);
  }
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const minutes = parseInt(timeStr);
  if (!isNaN(minutes)) return minutes;
  return 0;
}

function parseJSONSafely(str) {
  try {
    return JSON.parse(str);
  } catch {
    // If JSON parse fails, try splitting by commas
    return str.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }
}

async function importRecipes() {
  try {
    // First, copy images to public directory
    await copyImages();
    
    // Read CSV file
    const csvPath = path.join(projectRoot, 'data', 'csv', 'recipes_rows.csv');
    const csvContent = await fs.promises.readFile(csvPath, 'utf-8');
    
    // Parse CSV
    const records = await new Promise((resolve, reject) => {
      parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        cast: true
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Transform and import recipes
    const recipes = records.map(record => ({
      id: record.id,
      title: record.name,
      description: record.description,
      image_url: `/images/recipes/${path.basename(record.image_url)}`,
      ingredients: parseJSONSafely(record.ingredients),
      steps: parseJSONSafely(record.steps),
      cook_time: parseTimeToMinutes(record.cook_time),
      prep_time: parseTimeToMinutes(record.prep_time),
      servings: parseInt(record.servings) || 0,
      required_cookware: parseJSONSafely(record.required_cookware),
      protein_tags: parseJSONSafely(record.protein_tags),
      veggie_tags: parseJSONSafely(record.veggie_tags),
      herb_tags: parseJSONSafely(record.herb_tags),
      cuisine_type: record.cuisine_type,
      created_at: new Date(record.created_at),
      updated_at: new Date(record.updated_at)
    }));

    // Import to database
    await db.transaction(async (trx) => {
      for (const recipe of recipes) {
        await trx('recipes').insert(recipe).onConflict('id').merge();
      }
    });

    console.log(`Successfully imported ${recipes.length} recipes`);
    process.exit(0);
    
  } catch (error) {
    console.error('Error importing recipes:', error);
    process.exit(1);
  }
}

// Run the import
importRecipes();

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const sqlite3 = require('better-sqlite3');

const projectRoot = path.join(__dirname, '..');
const dbPath = path.join(projectRoot, 'src', 'database', 'db.sqlite3');
const db = new sqlite3(dbPath);

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
    return JSON.stringify(JSON.parse(str));
  } catch {
    // If JSON parse fails, try splitting by commas
    return JSON.stringify(str.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(Boolean));
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

    // Begin transaction
    const transaction = db.transaction((recipes) => {
      const insert = db.prepare(`
        INSERT OR REPLACE INTO recipes (
          id, title, description, image_url, ingredients, steps,
          cook_time, prep_time, servings, required_cookware,
          protein_tags, veggie_tags, herb_tags, cuisine_type,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const recipe of recipes) {
        insert.run(
          recipe.id,
          recipe.title,
          recipe.description,
          recipe.image_url,
          recipe.ingredients,
          recipe.steps,
          recipe.cook_time,
          recipe.prep_time,
          recipe.servings,
          recipe.required_cookware,
          recipe.protein_tags,
          recipe.veggie_tags,
          recipe.herb_tags,
          recipe.cuisine_type,
          recipe.created_at.toISOString(),
          recipe.updated_at.toISOString()
        );
      }
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
      created_at: new Date(record.created_at || Date.now()),
      updated_at: new Date(record.updated_at || Date.now())
    }));

    // Execute transaction
    transaction(recipes);

    console.log(`Successfully imported ${recipes.length} recipes`);
    process.exit(0);
    
  } catch (error) {
    console.error('Error importing recipes:', error);
    process.exit(1);
  }
}

// Run the import
importRecipes();

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { promisify } from 'util';
import { dbService } from '../db';

// Recipe type definition since it's not exported from db.ts
interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  prepTime?: string;
  totalTime?: string;
  recipeYield?: string;
  category?: string;
  cuisine?: string;
  author?: string;
  proteinTags: string[];
  veggieTags: string[];
  herbTags: string[];
  cookware: string[];
  difficulty?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CSVRecipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string;
  steps: string;
  cook_time: string;
  prep_time: string;
  servings: string;
  required_cookware: string;
  protein_tags: string;
  veggie_tags: string;
  herb_tags: string;
  cuisine_type: string;
  created_at: string;
  updated_at: string;
}

const readFile = promisify(fs.readFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

async function ensureDirectoryExists(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') throw error;
  }
}

async function copyImages() {
  const sourceDir = path.join(process.cwd(), 'data', 'images', 'Recipe Stock Photos');
  const targetDir = path.join(process.cwd(), 'public', 'images', 'recipes');
  
  // Ensure target directory exists
  await ensureDirectoryExists(targetDir);
  
  // Get list of image files
  const files = await fs.promises.readdir(sourceDir);
  
  // Copy each image
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    await copyFile(sourcePath, targetPath);
    console.log(`Copied ${file} to public directory`);
  }
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const minutes = parseInt(timeStr);
  if (!isNaN(minutes)) return minutes;
  return 0;
}

function parseJSONSafely(str: string): string[] {
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
    const csvPath = path.join(process.cwd(), 'data', 'csv', 'recipes_rows.csv');
    const csvContent = await readFile(csvPath, 'utf-8');
    
    // Parse CSV
    const records: CSVRecipe[] = await new Promise((resolve, reject) => {
      parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        cast: true
      }, (err: any, data: any) => {
        if (err) reject(err);
        else resolve(data as CSVRecipe[]);
      });
    });

    // Transform and import recipes
    const recipes: Recipe[] = records.map(record => ({
      id: record.id,
      title: record.name,
      description: record.description,
      image: `/images/recipes/${path.basename(record.image_url)}`,
      ingredients: parseJSONSafely(record.ingredients),
      instructions: parseJSONSafely(record.steps),
      cookTime: record.cook_time,
      prepTime: record.prep_time,
      totalTime: '',
      recipeYield: record.servings,
      category: '',
      cuisine: record.cuisine_type,
      author: '',
      proteinTags: parseJSONSafely(record.protein_tags),
      veggieTags: parseJSONSafely(record.veggie_tags),
      herbTags: parseJSONSafely(record.herb_tags),
      cookware: parseJSONSafely(record.required_cookware),
      difficulty: '',
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at)
    }));

    // Import to database
    await dbService.importRecipesFromCSV(recipes);
    console.log(`Successfully imported ${recipes.length} recipes`);
    
  } catch (error) {
    console.error('Error importing recipes:', error);
    process.exit(1);
  }
}

// Run the import
importRecipes().then(() => {
  console.log('Recipe import completed successfully');
  process.exit(0);
});
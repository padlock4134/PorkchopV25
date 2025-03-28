import knex from 'knex';
import config from './knexfile';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

interface CSVRecipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  cookTime?: string;
  prepTime?: string;
  totalTime?: string;
  recipeYield?: string;
  category?: string;
  cuisine?: string;
  author?: string;
  proteinTags: string;
  veggieTags: string;
  herbTags: string;
  cookware: string;
  difficulty?: string;
}

const prisma = new PrismaClient();
const db = knex(config);

async function main() {
  try {
    await db.migrate.latest();
    console.log('Migrations completed successfully.');

    const csvPath = path.join(__dirname, '../../data/csv/recipes_rows.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const { data } = Papa.parse<CSVRecipe>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });

    await prisma.recipe.deleteMany({});
    await prisma.image.deleteMany({});

    for (const recipe of data) {
      await prisma.recipe.create({
        data: {
          id: recipe.id || String(Math.random()),
          title: recipe.title || '',
          description: recipe.description || '',
          ingredients: recipe.ingredients || '[]',
          instructions: recipe.instructions || '[]',
          cookTime: recipe.cookTime || '',
          prepTime: recipe.prepTime || '',
          totalTime: recipe.totalTime || '',
          recipeYield: recipe.recipeYield || '',
          category: recipe.category || '',
          cuisine: recipe.cuisine || '',
          author: recipe.author || '',
          proteinTags: recipe.proteinTags || '[]',
          veggieTags: recipe.veggieTags || '[]',
          herbTags: recipe.herbTags || '[]',
          cookware: recipe.cookware || '[]',
          difficulty: recipe.difficulty || ''
        }
      });
    }
  } catch (error) {
    console.error('Error running migrations or seeding data:', error);
  } finally {
    await prisma.$disconnect();
    await db.destroy();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

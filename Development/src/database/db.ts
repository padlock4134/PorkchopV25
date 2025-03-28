import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export interface DatabaseService {
  query: (sql: string, params?: any[]) => Promise<any[]>;
  execute: (sql: string, params?: any[]) => Promise<void>;
  close: () => Promise<void>;
  importRecipesFromCSV: (recipes: Recipe[]) => Promise<void>;
}

export const dbService: DatabaseService = {
  query: async (sql, params = []) => {
    return prisma.$queryRawUnsafe(sql, ...params);
  },
  execute: async (sql, params = []) => {
    await prisma.$executeRawUnsafe(sql, ...params);
  },
  close: async () => {
    await prisma.$disconnect();
  },
  importRecipesFromCSV: async (recipes: Recipe[]) => {
    try {
      await prisma.recipe.createMany({ data: recipes });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to import recipes: ${error.message}`);
      } else {
        throw new Error('Failed to import recipes: Unknown error occurred');
      }
    }
  },
};
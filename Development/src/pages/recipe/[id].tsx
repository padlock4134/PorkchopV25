import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    if (req.method === 'GET') {
      // Get a single recipe with its images
      const recipe = await prisma.recipe.findUnique({
        where: {
          id: id,
        },
        include: {
          images: true, // This is the only relation in your schema
        },
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      // Parse string fields that are stored as JSON strings
      const parsedRecipe = {
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients),
        instructions: recipe.instructions, // This might need parsing if it's JSON
        proteinTags: JSON.parse(recipe.proteinTags),
        veggieTags: JSON.parse(recipe.veggieTags),
        herbTags: JSON.parse(recipe.herbTags),
        cookware: JSON.parse(recipe.cookware),
      };

      return res.status(200).json(parsedRecipe);
    } else if (req.method === 'PUT') {
      // For update, we need to stringify any JSON fields from the request body
      const { 
        ingredients, 
        proteinTags, 
        veggieTags, 
        herbTags, 
        cookware,
        ...otherFields 
      } = req.body;
      
      const updatedRecipe = await prisma.recipe.update({
        where: {
          id: id,
        },
        data: {
          ...otherFields,
          ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients),
          proteinTags: typeof proteinTags === 'string' ? proteinTags : JSON.stringify(proteinTags),
          veggieTags: typeof veggieTags === 'string' ? veggieTags : JSON.stringify(veggieTags),
          herbTags: typeof herbTags === 'string' ? herbTags : JSON.stringify(herbTags),
          cookware: typeof cookware === 'string' ? cookware : JSON.stringify(cookware),
        },
      });

      return res.status(200).json(updatedRecipe);
    } else if (req.method === 'DELETE') {
      // Delete related images first to avoid foreign key constraints
      await prisma.image.deleteMany({
        where: {
          recipeId: id,
        },
      });
      
      // Then delete the recipe
      await prisma.recipe.delete({
        where: {
          id: id,
        },
      });

      return res.status(204).end();
    } else {
      // Method not allowed
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Recipe API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
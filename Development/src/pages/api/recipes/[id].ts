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
      // Get a single recipe
      const recipe = await prisma.recipe.findUnique({
        where: {
          id: id,
        },
        include: {
          ingredients: true, // This needs to match your Prisma schema relationship
          requiredCookware: true,
          proteinTags: true,
          veggieTags: true,
          herbTags: true,
        },
      });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json(recipe);
    } else if (req.method === 'PUT') {
      // Update a recipe
      const updatedRecipe = await prisma.recipe.update({
        where: {
          id: id,
        },
        data: req.body,
      });

      return res.status(200).json(updatedRecipe);
    } else if (req.method === 'DELETE') {
      // Delete a recipe
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
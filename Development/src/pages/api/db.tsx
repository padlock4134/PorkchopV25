import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query: { endpoint }, body } = req;

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    switch (endpoint) {
      case 'getSavedRecipes':
        const recipes = await prisma.savedRecipes.findMany({
          where: { userId: body.userId }
        });
        return res.status(200).json(recipes);

      case 'getCollections':
        const collections = await prisma.collections.findMany({
          where: { userId: body.userId }
        });
        return res.status(200).json(collections);

      case 'saveRecipe':
        const savedRecipe = await prisma.savedRecipes.create({
          data: body
        });
        return res.status(200).json(savedRecipe);

      case 'removeSavedRecipe':
        await prisma.savedRecipes.delete({
          where: { id: body.recipeId }
        });
        return res.status(200).json({ success: true });

      default:
        return res.status(404).json({ message: 'Endpoint not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
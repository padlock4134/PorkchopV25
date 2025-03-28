import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  // Handle GET requests
  if (method === 'GET') {
    try {
      // For GET requests, return all recipes
      const recipes = await prisma.recipe.findMany();
      return res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle POST requests
  if (method === 'POST') {
    const { endpoint } = body;

    try {
      switch (endpoint) {
        case 'getRecipe':
          const recipe = await prisma.recipe.findUnique({
            where: { id: body.recipeId }
          });
          return res.status(200).json(recipe);

        case 'getRecipes':
          const recipes = await prisma.recipe.findMany();
          return res.status(200).json(recipes);

        case 'createRecipe':
          const newRecipe = await prisma.recipe.create({
            data: body
          });
          return res.status(201).json(newRecipe);

        case 'updateRecipe':
          const updatedRecipe = await prisma.recipe.update({
            where: { id: body.recipeId },
            data: body.updates
          });
          return res.status(200).json(updatedRecipe);

        case 'deleteRecipe':
          await prisma.recipe.delete({
            where: { id: body.recipeId }
          });
          return res.status(204).end();

        default:
          return res.status(404).json({ message: 'Endpoint not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle other methods
  return res.status(405).json({ message: 'Method not allowed' });
}
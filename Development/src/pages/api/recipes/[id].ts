import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { method } = req;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }

  try {
    switch (method) {
      case 'GET':
        const recipe = await prisma.recipes.findUnique({
          where: { id },
          include: {
            images: true,
            ingredients: true,
            instructions: true
          }
        });
        
        if (!recipe) {
          return res.status(404).json({ error: 'Recipe not found' });
        }
        
        return res.status(200).json(recipe);

      case 'PUT':
        const updatedRecipe = await prisma.recipes.update({
          where: { id },
          data: req.body
        });
        return res.status(200).json(updatedRecipe);

      case 'DELETE':
        await prisma.recipes.delete({
          where: { id }
        });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in recipe API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
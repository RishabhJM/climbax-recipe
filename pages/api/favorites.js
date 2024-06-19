import clientPromise from '../../utils/mongodb';
import { ObjectId } from 'mongodb';


export default async (req, res) => {
  const client = await clientPromise;
  const db = client.db('recipes');

  switch (req.method) {
    case 'GET':
      const favorites = await db.collection('favorites').find({ userId: req.query.userId }).toArray();
      res.json(favorites);
      break;
    case 'POST':
      const { userId, recipeId } = req.body;
      await db.collection('favorites').insertOne({ userId, recipeId });
      res.status(201).json({ message: 'Recipe favorited!' });
      break;
    case 'DELETE':
      const { userId: delUserId, recipeId: delRecipeId } = req.body;
      await db.collection('favorites').deleteOne({ userId: delUserId, recipeId: delRecipeId });
      res.status(200).json({ message: 'Recipe unfavorited!' });
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
};

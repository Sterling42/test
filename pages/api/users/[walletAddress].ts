import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ message: 'Invalid wallet address' });
  }

  await client.connect();
  const db = client.db('walletRPG');
  const collection = db.collection('users');

  const user = await collection.findOne({ walletAddress });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
}

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    await client.connect();
    const db = client.db('walletRPG');
    const collection = db.collection('users');

    const user = await collection.findOne({ walletAddress });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
      walletAddress,
      stats: {
        ATK: 1,
        DEF: 1,
        HP: 1,
      },
    };

    await collection.insertOne(newUser);

    res.status(201).json(newUser);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default handler;

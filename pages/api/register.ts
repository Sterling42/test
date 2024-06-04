import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client: MongoClient;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address is required' });
      }

      const client = await connectToDatabase();
      const db = client.db('walletRPG');
      const collection = db.collection('users');

      const user = await collection.findOne({ walletAddress });

      if (user) {
        return res.status(200).json(user);
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
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default handler;

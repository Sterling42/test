// GenerateEnemies.js
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: '../.env.local' });

const uri = process.env.MONGODB_URI; // Load MongoDB Atlas connection string from environment variable

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db('test');
    const enemies = database.collection('enemies');

    // Generate 100 enemies
    for (let i = 0; i < 100; i++) {
      const enemy = {
        id: i.toString(),
        stats: {
          ATK: Math.floor(Math.random() * 100) + 1,
          DEF: Math.floor(Math.random() * 100) + 1,
          HP: Math.floor(Math.random() * 100) + 1,
          INT: Math.floor(Math.random() * 100) + 1,
          SPD: Math.floor(Math.random() * 100) + 1,
          END: Math.floor(Math.random() * 100) + 1,
          CRIT: Math.floor(Math.random() * 100) + 1,
          LUCK: Math.floor(Math.random() * 100) + 1,
          DGN: Math.floor(Math.random() * 100) + 1,
        },
      };

      await enemies.insertOne(enemy);
    }

    console.log('Enemies generated successfully');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
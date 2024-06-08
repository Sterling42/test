const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: '../.env.local' });

async function checkEnemy() {
  try {
    // Connect to the MongoDB client
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Fetch the enemies from the database
    const db = client.db(process.env.DB_NAME);
    const enemiesCollection = db.collection('enemies');

    // Check if there's an enemy with id '1'
    const enemy = await enemiesCollection.findOne({ id: '1' });
    if (!enemy) {
      console.log('No enemy with id 1 found');
    } else {
      console.log('Enemy with id 1 found:', enemy);
    }

    // Close the MongoDB connection
    await client.close();
  } catch (error) {
    console.error('Error fetching enemy:', error);
  }
}

checkEnemy().catch(console.error);
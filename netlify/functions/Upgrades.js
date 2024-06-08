// netlify/functions/Upgrades.js
import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  const { walletAddress, stat } = req.body;

  // Connect to the database
  const db = await dbConnect();

  // Fetch the user's stats from the database
  const user = await db.collection('users').findOne({ walletAddress });

  // Perform the upgrade
  const updatedStats = { ...user.stats, [stat]: user.stats[stat] + 1 };
  const totalPower = Object.values(updatedStats).reduce((a, b) => a + b, 0);

  // Update the user's stats
  await db.collection('users').updateOne(
    { walletAddress },
    { $set: { stats: updatedStats, totalPower } }
  );

  // Return the updated stats
  const updatedUser = await db.collection('users').findOne({ walletAddress });
  res.json({ data: updatedUser });
}
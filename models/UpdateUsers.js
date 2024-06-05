import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './User.js'; // import your User model

dotenv.config({ path: '../.env.local' }); // load environment variables from .env.local file

// Define the new fields with their default values
const newStats = {
  INT: 1,
  SPD: 1,
  END: 1,
  CRIT: 1,
  LUCK: 1,
  DGN: 1,
};

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

async function updateUsers() {
  // Get all users
  const users = await User.find({});

  // Iterate over each user
  for (let user of users) {
    // Merge the existing stats with the new stats
    user.stats = { ...user.stats, ...newStats };

    // Save the updated user
    await user.save();
  }

  console.log('All users updated successfully');
}

// Run the update function
updateUsers().catch(console.error);
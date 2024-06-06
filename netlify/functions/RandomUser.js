const mongoose = require('mongoose');
const User = require('../../models/User');

exports.handler = async function(event, context) {
  // Connect to the database
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Get all users
  const users = await User.find({});

  // Select a random user
  let randomUser = users[Math.floor(Math.random() * users.length)];

  // Log the wallet address of the random user
  console.log('Random user wallet address:', randomUser.walletAddress);

  // Parse event.body if it's not undefined
  let currentUserId;
  if (event.body) {
    const body = JSON.parse(event.body);
    currentUserId = body.userId;
  }

  // Make sure the random user is not the same as the current user
  // If it is, select another random user
  while (randomUser.id === currentUserId) {
    randomUser = users[Math.floor(Math.random() * users.length)];
  }

  // Return the random user's wallet address
  return {
    statusCode: 200,
    body: JSON.stringify({ walletAddress: randomUser.walletAddress }),
  };
};
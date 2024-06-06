import mongoose from 'mongoose';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      const { walletAddress } = req.query;
      if (!walletAddress || walletAddress.length !== 44) {
        return res.status(400).json({ success: false, message: 'Invalid wallet address' });
      }
      try {
        const user = await User.findOne({ walletAddress });
        if (user) {
          res.status(200).json({ success: true, data: user });
        } else {
          // Return a successful response with a specific message
          res.status(200).json({ success: false, message: 'User not found' });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      case 'POST':
        try {
          const { walletAddress, stats } = req.body;
          if (!walletAddress || walletAddress.length !== 44) {
            return res.status(400).json({ success: false, message: 'Invalid wallet address' });
          }
          const existingUser = await User.findOne({ walletAddress });
          if (existingUser) {
            return res.status(400).json({ success: false, message: 'Wallet already registered' });
          }
      
          // Create the new user
          const user = new User({
            walletAddress,
            stats,
          });
      
          // Save the user to the database
          await user.save();
      
          res.status(201).json({ success: true, data: user });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
        break;
      
      case 'PUT':
        const { walletAddress: updateWalletAddress, stats, xGold, XP } = req.body;
        if (!updateWalletAddress || updateWalletAddress.length !== 44) {
          return res.status(400).json({ success: false, message: 'Invalid wallet address' });
        }
      try {
        const user = await User.findOne({ walletAddress: updateWalletAddress });
        if (user) {
          // Merge the provided stats with the current stats
          user.stats = { ...user.stats, ...stats };
          user.xGold = xGold || user.xGold;
          user.XP = XP || user.XP;
          const updatedUser = await user.save();
          res.status(200).json({ success: true, data: updatedUser });
        } else {
          res.status(404).json({ success: false, message: 'User not found' });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
  }
}
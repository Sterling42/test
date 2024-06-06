const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  stats: {
    ATK: { type: Number, default: 1 },
    DEF: { type: Number, default: 1 },
    HP: { type: Number, default: 1 },
    INT: { type: Number, default: 1 },
    SPD: { type: Number, default: 1 },
    END: { type: Number, default: 1 },
    CRIT: { type: Number, default: 1 },
    LUCK: { type: Number, default: 1 },
    DGN: { type: Number, default: 1 },
  },
  xGold: { type: Number, default: 0 },
  XP: { type: Number, default: 0 },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
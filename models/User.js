// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  robloxId: { type: String, unique: true },
  robloxUsername: String,
  verifiedAt: Date,
  moderationHistory: [{
    action: String,
    reason: String,
    moderator: String,
    timestamp: Date,
    source: String // "discord" or "roblox"
  }],
  ticketHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
});

module.exports = mongoose.model('User', userSchema);
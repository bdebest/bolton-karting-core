// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  robloxId: { type: String, sparse: true, unique: true },
  robloxUsername: String,
  verifiedAt: Date,

  // Moderation
  moderationHistory: [{
    action: String,
    reason: String,
    moderator: String,
    timestamp: { type: Date, default: Date.now },
    source: { type: String, enum: ['discord', 'roblox', 'appeal'] }
  }],

  // Tickets
  ticketHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],

  // Staff Features
  staffNotes: [{
    note: String,
    addedBy: String,
    timestamp: { type: Date, default: Date.now }
  }],
  flags: [{ type: String }], // "vip", "suspicious", "alt", etc.

  // Group Sync
  robloxGroupRoles: [{
    roleId: String,
    roleName: String,
    syncedAt: Date
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
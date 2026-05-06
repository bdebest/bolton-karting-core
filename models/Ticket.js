// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  discordId: { type: String, required: true },
  robloxId: String,
  robloxUsername: String,
  type: { type: String, enum: ['appeal', 'support', 'report', 'other'] },
  status: { type: String, default: 'open', enum: ['open', 'in-progress', 'closed'] },
  reason: String,
  transcript: String,
  staffNotes: String,
  createdAt: { type: Date, default: Date.now },
  closedAt: Date,
  closedBy: String
});

module.exports = mongoose.model('Ticket', ticketSchema);
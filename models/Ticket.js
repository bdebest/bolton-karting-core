// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  discordId: { type: String, required: true },
  robloxId: String,
  robloxUsername: String,
  type: { type: String, enum: ['appeal', 'support', 'report', 'other'], required: true },
  status: { type: String, default: 'open', enum: ['open', 'closed', 'in-progress'] },
  reason: String,
  transcript: String,
  createdAt: { type: Date, default: Date.now },
  closedAt: Date,
  closedBy: String,
  staffNotes: String
});

module.exports = mongoose.model('Ticket', ticketSchema);
// routes/tickets.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.post('/create', authenticateBot, async (req, res) => {
  try {
    const { ticketId, discordId, robloxId, robloxUsername, type, reason } = req.body;

    const ticket = new Ticket({
      ticketId,
      discordId,
      robloxId,
      robloxUsername,
      type,
      reason
    });

    await ticket.save();

    // Link to user
    let user = await User.findOne({ discordId });
    if (!user) user = new User({ discordId });
    user.ticketHistory.push(ticket._id);
    await user.save();

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/close', authenticateBot, async (req, res) => {
  try {
    const { ticketId, closedBy, transcript, staffNotes } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { ticketId },
      { status: 'closed', closedAt: new Date(), closedBy, transcript, staffNotes },
      { new: true }
    );

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
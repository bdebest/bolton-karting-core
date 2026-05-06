// routes/tickets.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.post('/create', authenticateBot, async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();

    await User.findOneAndUpdate(
      { discordId: req.body.discordId },
      { $push: { ticketHistory: ticket._id } }
    );

    res.json({ success: true, ticketId: ticket.ticketId });
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

router.get('/search', authenticateBot, async (req, res) => {
  const { discordId, status } = req.query;
  const query = {};
  if (discordId) query.discordId = discordId;
  if (status) query.status = status;

  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  res.json(tickets);
});

module.exports = router;
// routes/analytics.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { authenticateBot } = require('../middleware/auth');

router.get('/stats', authenticateBot, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ verifiedAt: { $exists: true } });
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });

    res.json({
      totalVerifiedUsers: totalUsers,
      totalTickets,
      openTickets,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
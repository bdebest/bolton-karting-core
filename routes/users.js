// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.get('/:discordId', authenticateBot, async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.params.discordId })
      .populate('ticketHistory');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      discordId: user.discordId,
      robloxId: user.robloxId,
      robloxUsername: user.robloxUsername,
      verifiedAt: user.verifiedAt,
      moderationHistory: user.moderationHistory,
      tickets: user.ticketHistory,
      totalTickets: user.ticketHistory.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
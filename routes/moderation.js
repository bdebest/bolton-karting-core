// routes/moderation.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.post('/log', authenticateBot, async (req, res) => {
  try {
    const { discordId, action, reason, moderator, source } = req.body;

    let user = await User.findOne({ discordId });

    if (!user) {
      user = new User({ discordId });
    }

    user.moderationHistory.push({
      action,
      reason,
      moderator,
      timestamp: new Date(),
      source: source || 'discord' // "discord" or "roblox"
    });

    await user.save();

    res.json({ success: true, message: 'Moderation logged' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
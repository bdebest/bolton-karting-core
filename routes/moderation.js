// routes/moderation.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.post('/log', authenticateBot, async (req, res) => {
  try {
    const { discordId, action, reason, moderator, source = 'discord' } = req.body;

    let user = await User.findOne({ discordId }) || new User({ discordId });

    user.moderationHistory.push({ action, reason, moderator, source });
    await user.save();

    res.json({ success: true, message: 'Moderation logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
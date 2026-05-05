// routes/moderation.js
const express = require('express');
const router = express.Router();
const { authenticateBot } = require('../middleware/auth');

router.post('/log', authenticateBot, async (req, res) => {
  // This will be used by your bots to sync moderation
  res.json({ success: true });
});

module.exports = router;
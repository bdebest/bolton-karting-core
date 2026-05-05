// routes/auth.js
const express = require('express');
const router = express.Router();
const { exchangeCode, getUserInfo } = require('../utils/roblox');
const User = require('../models/User');

// POST /api/auth/callback - Called from OAuth callback
router.post('/callback', async (req, res) => {
  try {
    const { code, discordId } = req.body;
    // ... verification logic later
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
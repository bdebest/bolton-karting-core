// routes/auth.js
const express = require('express');
const router = express.Router();
const { exchangeCode, getUserInfo } = require('../utils/roblox');
const User = require('../models/User');

router.get('/roblox', (req, res) => {   // Start verification
  // ... (your existing /auth/roblox logic)
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    // Add full logic here later (verify state, save to MongoDB, etc.)
    res.send('<h1>✅ Verification Successful! You can return to Discord.</h1>');
  } catch (error) {
    res.status(500).send('Verification failed.');
  }
});

module.exports = router;
// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { exchangeCode, getUserInfo } = require('../utils/roblox');
const User = require('../models/User');

const pendingStates = new Map();

router.get('/roblox', (req, res) => {
  const { discordId } = req.query;
  if (!discordId) return res.status(400).json({ error: 'Missing discordId' });

  const state = crypto.randomBytes(32).toString('hex');
  pendingStates.set(state, { discordId, expiresAt: Date.now() + 900000 });

  const authUrl = `https://apis.roblox.com/oauth/v1/authorize?` +
    `client_id=${process.env.ROBLOX_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&scope=openid profile` +
    `&state=${state}`;

  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const pending = pendingStates.get(state);
    if (!pending || Date.now() > pending.expiresAt) {
      return res.status(400).send('Link expired.');
    }

    const tokenData = await exchangeCode(code);
    const robloxUser = await getUserInfo(tokenData.access_token);

    let user = await User.findOne({ discordId: pending.discordId }) || new User({ discordId: pending.discordId });
    user.robloxId = robloxUser.sub;
    user.robloxUsername = robloxUser.name || robloxUser.preferred_username;
    user.verifiedAt = new Date();
    await user.save();

    pendingStates.delete(state);

    res.send(`<h1 style="color:green">✅ Account Linked Successfully!</h1><script>setTimeout(() => window.close(), 3000);</script>`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Verification failed.');
  }
});

module.exports = router;
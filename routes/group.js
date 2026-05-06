// routes/group.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.post('/sync', authenticateBot, async (req, res) => {
  try {
    const { discordId, roles } = req.body; // roles = [{roleId, roleName}]
    const user = await User.findOneAndUpdate(
      { discordId },
      { $set: { robloxGroupRoles: roles.map(r => ({...r, syncedAt: new Date()})) } },
      { new: true, upsert: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
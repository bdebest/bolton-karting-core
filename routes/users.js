// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

router.get('/:discordId', authenticateBot, async (req, res) => {
  const user = await User.findOne({ discordId: req.params.discordId }).populate('ticketHistory');
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    discordId: user.discordId,
    robloxId: user.robloxId,
    robloxUsername: user.robloxUsername,
    verified: !!user.verifiedAt,
    verifiedAt: user.verifiedAt,
    moderationHistory: user.moderationHistory,
    tickets: user.ticketHistory,
    flags: user.flags,
    staffNotes: user.staffNotes,
    groupRoles: user.robloxGroupRoles
  });
});

router.post('/:discordId/note', authenticateBot, async (req, res) => {
  const { note, addedBy } = req.body;
  const user = await User.findOneAndUpdate(
    { discordId: req.params.discordId },
    { $push: { staffNotes: { note, addedBy } } },
    { new: true }
  );
  res.json({ success: true, user });
});

router.post('/:discordId/flag', authenticateBot, async (req, res) => {
  const { flags } = req.body;
  const user = await User.findOneAndUpdate(
    { discordId: req.params.discordId },
    { flags },
    { new: true }
  );
  res.json({ success: true, flags: user.flags });
});

module.exports = router;
// routes/suggestions.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

/**
 * POST /api/suggestions/blacklist
 * Blacklist a user from making suggestions
 */
router.post('/blacklist', authenticateBot, async (req, res) => {
  try {
    const { discordId, reason } = req.body;

    if (!discordId) {
      return res.status(400).json({ error: 'discordId is required' });
    }

    const user = await User.findOneAndUpdate(
      { discordId },
      { 
        $addToSet: { flags: 'suggestion-blacklisted' },
        $push: {
          staffNotes: {
            note: `Blacklisted from suggestions: ${reason || 'No reason provided'}`,
            addedBy: 'System (Suggestions Module)',
            timestamp: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );

    console.log(`✅ Suggestion blacklist added for ${discordId}`);
    res.json({ 
      success: true, 
      message: 'User has been blacklisted from suggestions',
      user 
    });
  } catch (error) {
    console.error('Blacklist error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/suggestions/unblacklist
 * Remove suggestion blacklist
 */
router.post('/unblacklist', authenticateBot, async (req, res) => {
  try {
    const { discordId } = req.body;

    if (!discordId) {
      return res.status(400).json({ error: 'discordId is required' });
    }

    const user = await User.findOneAndUpdate(
      { discordId },
      { 
        $pull: { flags: 'suggestion-blacklisted' },
        $push: {
          staffNotes: {
            note: 'Unblacklisted from suggestions',
            addedBy: 'System (Suggestions Module)',
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    console.log(`✅ Suggestion blacklist removed for ${discordId}`);
    res.json({ 
      success: true, 
      message: 'User has been unblacklisted from suggestions',
      user 
    });
  } catch (error) {
    console.error('Unblacklist error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/suggestions/blacklist/:discordId
 * Check if a user is blacklisted from suggestions
 */
router.get('/blacklist/:discordId', authenticateBot, async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.params.discordId });
    
    const isBlacklisted = user?.flags?.includes('suggestion-blacklisted') || false;

    res.json({
      discordId: req.params.discordId,
      blacklisted: isBlacklisted,
      hasFlags: user?.flags || []
    });
  } catch (error) {
    console.error('Check blacklist error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
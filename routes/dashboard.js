// routes/dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const OWNER_IDS = process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',') : [];

// Simple login page (no passport for now to avoid crashes)
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/', async (req, res) => {
  // Temporary - just show dashboard for testing
  try {
    const stats = {
      totalVerified: await User.countDocuments({ verifiedAt: { $exists: true } }) || 0,
      openTickets: 0
    };

    const recentUsers = await User.find().sort({ updatedAt: -1 }).limit(10);

    res.render('dashboard', { 
      user: { username: "Test User", id: "123456" },
      isOwner: true,
      stats, 
      recentUsers 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Database error');
  }
});

module.exports = router;
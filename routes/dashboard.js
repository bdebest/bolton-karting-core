// routes/dashboard.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

const OWNER_IDS = process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',') : [];

// Only initialize Discord Strategy if credentials exist
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  const DiscordStrategy = require('passport-discord').Strategy;

  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DASHBOARD_REDIRECT_URI,
    scope: ['identify']
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/auth/discord', (req, res, next) => {
  if (!process.env.DISCORD_CLIENT_ID) {
    return res.send('❌ Discord OAuth is not configured yet.');
  }
  passport.authenticate('discord')(req, res, next);
});

router.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/dashboard/login' }),
  (req, res) => {
    if (!OWNER_IDS.includes(req.user.id)) {
      return res.send('❌ Access Denied - You are not listed as Owner.');
    }
    res.redirect('/dashboard');
  }
);

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/dashboard/login');
  }

  const stats = {
    totalVerified: await User.countDocuments({ verifiedAt: { $exists: true } }),
    openTickets: 0 // Can be expanded later
  };

  const recentUsers = await User.find().sort({ updatedAt: -1 }).limit(20);

  res.render('dashboard', { 
    user: req.user, 
    isOwner: OWNER_IDS.includes(req.user.id),
    stats, 
    recentUsers 
  });
});

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/dashboard/login'));
});

module.exports = router;
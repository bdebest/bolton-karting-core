// routes/dashboard.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

const OWNER_IDS = process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',') : [];

// Discord Strategy
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DASHBOARD_REDIRECT_URI,
  scope: ['identify']
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware to check Owner
const isOwner = (req, res, next) => {
  if (req.isAuthenticated() && OWNER_IDS.includes(req.user.id)) return next();
  res.status(403).send('❌ Owner access required');
};

// Routes
router.get('/login', (req, res) => res.render('login'));

router.get('/auth/discord', passport.authenticate('discord'));

router.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/dashboard/login' }),
  (req, res) => {
    if (!OWNER_IDS.includes(req.user.id)) {
      return res.send('❌ You are not authorized as Owner.');
    }
    res.redirect('/dashboard');
  }
);

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/dashboard/login');

  const isOwnerUser = OWNER_IDS.includes(req.user.id);

  const stats = {
    totalVerified: await User.countDocuments({ verifiedAt: { $exists: true } }),
    openTickets: await User.countDocuments({ 'ticketHistory.0': { $exists: true } }) // Simplified
  };

  const recentUsers = await User.find().sort({ updatedAt: -1 }).limit(20);

  res.render('dashboard', { 
    user: req.user, 
    isOwner: isOwnerUser,
    stats, 
    recentUsers 
  });
});

module.exports = router;
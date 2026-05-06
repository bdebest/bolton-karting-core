// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session & Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/public', express.static('public'));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/moderation', require('./routes/moderation'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/group', require('./routes/group'));
app.use('/api/analytics', require('./routes/analytics'));

// Dashboard
app.use('/dashboard', require('./routes/dashboard'));

// Health Check
app.get('/health', (req, res) => res.json({ status: '✅ Bolton Karting Core Healthy' }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Bolton Karting Core running on port ${PORT}`);
});
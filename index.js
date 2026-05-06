// index.js - Clean Version (Dashboard Disabled)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health
app.get('/health', (req, res) => res.json({ status: '✅ Core Healthy' }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Bolton Karting Core running on port ${PORT}`);
});
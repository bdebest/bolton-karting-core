// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Import routes safely with fallback
const authRoutes = require('./routes/auth') || { use: () => {} };
const userRoutes = require('./routes/users') || { use: () => {} };
const modRoutes = require('./routes/moderation') || { use: () => {} };

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/moderation', modRoutes);
app.use('/api/tickets', require('./routes/tickets'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Bolton Karting Core API Healthy ✅',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Bolton Karting Core running on port ${PORT}`);
});
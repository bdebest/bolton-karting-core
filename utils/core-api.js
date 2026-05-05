// utils/core-api.js
const axios = require('axios');

const CORE_URL = 'https://bolton-karting-core.onrender.com';
const API_SECRET = process.env.INTERNAL_API_SECRET;

const api = axios.create({
  baseURL: CORE_URL,
  headers: {
    'x-api-key': API_SECRET,
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Retry logic (up to 3 attempts)
const retryRequest = async (requestFn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === retries - 1) throw error; // Last attempt failed
      console.warn(`Core API retry ${i + 1}/${retries} after error`);
      await new Promise(res => setTimeout(res, delay * (i + 1))); // Backoff
    }
  }
};

module.exports = {
  // Detailed User Lookup
  getUser: (discordId) => 
    retryRequest(() => api.get(`/api/users/${discordId}`)),

  // Moderation Sync
  logModeration: (data) => 
    retryRequest(() => api.post('/api/moderation/log', data)),

  // Ticket Sync
  createTicket: (data) => 
    retryRequest(() => api.post('/api/tickets/create', data)),
  
  closeTicket: (data) => 
    retryRequest(() => api.post('/api/tickets/close', data)),

  // Health Check
  healthCheck: () => 
    retryRequest(() => api.get('/health'))
};
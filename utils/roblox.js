// utils/roblox.js
const axios = require('axios');

const exchangeCode = async (code) => {
  const response = await axios.post('https://apis.roblox.com/oauth/v1/token', {
    client_id: process.env.ROBLOX_CLIENT_ID,
    client_secret: process.env.ROBLOX_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
  }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

const getUserInfo = async (accessToken) => {
  const response = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};

module.exports = { exchangeCode, getUserInfo };
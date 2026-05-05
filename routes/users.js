// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/:discordId', async (req, res) => {
  res.json({ message: 'User endpoint - coming soon' });
});

module.exports = router;
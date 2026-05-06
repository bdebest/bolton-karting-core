// middleware/auth.js
const authenticateBot = (req, res, next) => {
  const providedKey = req.headers['x-api-key'] || req.headers.authorization;

  if (!providedKey || providedKey !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  next();
};

module.exports = { authenticateBot };
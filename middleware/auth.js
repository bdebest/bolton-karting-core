// middleware/auth.js
const authenticateBot = (req, res, next) => {
  const authHeader = req.headers['x-api-key'] || req.headers.authorization;

  if (!authHeader || authHeader !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API Key' });
  }

  next();
};

module.exports = { authenticateBot };
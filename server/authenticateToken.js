const { verify } = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.json({ error: 'Unauthorized' });
  }

  try {
    const validToken = verify(token, 'SuperSecretKey');
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateToken };

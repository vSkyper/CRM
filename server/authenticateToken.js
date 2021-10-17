const { verify } = require('jsonwebtoken');
const { users } = require('./models');

const authenticateToken = async (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.json({ error: 'Unauthorized' });
  }

  try {
    const token = verify(tokenHeader, 'SuperSecretKey');
    if (token) {
      const user = await users.findOne({
        attributes: ['id'],
        where: { id: token.id, isDeleted: false },
      });

      if (!user) {
        return res.json({ error: 'Unauthorized' });
      }
      return next();
    }
  } catch (err) {
    return res.json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateToken };

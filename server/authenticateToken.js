const { verify } = require('jsonwebtoken');
const { users, roles } = require('./models');

const passRoles = (authorizedRoles) => {
  return (req, res, next) => {
    req.roles = authorizedRoles;
    next();
  };
};

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

      if (!user || !req.roles.includes(token.role)) {
        return res.json({ error: 'Unauthorized' });
      }

      req.role = token.role;

      return next();
    }
  } catch (error) {
    return res.json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateToken, passRoles };

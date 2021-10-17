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

      if (!user) {
        return res.json({ error: 'Unauthorized' });
      }

      const role = await roles.findOne({
        attributes: ['name'],
        where: { id: token.roleId },
      });

      if (!req.roles.includes(role.name)) {
        return res.json({ error: 'Unauthorized' });
      }

      req.user = role;

      return next();
    }
  } catch (error) {
    return res.json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateToken, passRoles };

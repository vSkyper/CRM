const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const db = require('./models');
const { users, roles } = require('./models');
const { authenticateToken, passRoles } = require('./authenticateToken');

app.use(cors());
app.use(express.json());

const { UniqueConstraintError, DatabaseError } = require('sequelize');

app.get(
  '/users/:page',
  passRoles(['user', 'moderator', 'admin']),
  authenticateToken,
  async (req, res) => {
    if (!req.params.page || isNaN(req.params.page) || req.params.page < 1) {
      return res.json({ error: 'Inavlid page number.' });
    }

    const limit = 10;
    const offset = (req.params.page - 1) * limit;

    try {
      let usersList = await users.findAndCountAll({
        attributes: ['id', 'name', 'surname', 'dateOfBirth', 'login', 'roleId'],
        limit,
        offset,
        where: {
          isDeleted: false,
        },
      });

      const totalPages = Math.ceil(usersList.count / limit);
      usersList = {
        ...usersList,
        totalPages,
      };

      return res.json(usersList);
    } catch (error) {
      return res.json({ error: 'Unknown error.' });
    }
  }
);

app.post('/loginUser', async (req, res) => {
  if (!req.body.login || !req.body.password) {
    return res.json({ error: 'Fill in all fields.' });
  }

  const user = await users.findOne({
    attributes: ['id', 'roleId', 'password'],
    where: { login: req.body.login, isDeleted: false },
  });

  if (!user) {
    return res.json({ error: 'Incorrect username or password.' });
  }

  const role = await roles.findOne({
    attributes: ['name'],
    where: { id: user.roleId },
  });

  bcrypt.compare(req.body.password, user.password, (error, result) => {
    if (result) {
      const jwtToken = sign(
        { id: user.id, role: role.name },
        'SuperSecretKey',
        {
          expiresIn: '10h',
        }
      );
      return res.json({ token: jwtToken, role: role.name });
    } else {
      return res.json({ error: 'Incorrect username or password.' });
    }
  });
});

app.post('/signupUser', async (req, res) => {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.dateOfBirth ||
    !req.body.login ||
    !req.body.password
  ) {
    return res.json({ error: 'Fill in all fields.' });
  }

  bcrypt.hash(req.body.password, 10, async (error, hash) => {
    try {
      await users.create({
        name: req.body.name,
        surname: req.body.surname,
        dateOfBirth: req.body.dateOfBirth,
        login: req.body.login,
        password: hash,
        isDeleted: false,
        roleId: 1,
      });
      return res.json('Success');
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.json({ error: 'This username is unavailable.' });
      } else if (error instanceof DatabaseError) {
        return res.json({ error: 'Check all fields.' });
      } else {
        return res.json({ error: 'Unknown error.' });
      }
    }
  });
});

app.put(
  '/editUser',
  passRoles(['moderator', 'admin']),
  authenticateToken,
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.surname ||
      !req.body.dateOfBirth ||
      !req.body.login ||
      !req.body.id ||
      !req.body.roleId
    ) {
      return res.json({ error: 'Fill in all fields.' });
    }

    try {
      await users.update(
        {
          name: req.body.name,
          surname: req.body.surname,
          dateOfBirth: req.body.dateOfBirth,
          login: req.body.login,
          roleId: req.body.roleId,
        },
        { where: { id: req.body.id } }
      );
      return res.json('Success');
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.json({ error: 'This username is unavailable.' });
      } else if (error instanceof DatabaseError) {
        return res.json({ error: 'Check all fields.' });
      } else {
        return res.json({ error: 'Unknown error.' });
      }
    }
  }
);

app.delete(
  '/deleteUser',
  passRoles(['admin']),
  authenticateToken,
  async (req, res) => {
    if (!req.body.id || isNaN(req.body.id) || req.body.id < 1) {
      return res.json({ error: 'Inavlid ID.' });
    }

    try {
      await users.update({ isDeleted: true }, { where: { id: req.body.id } });
      return res.json('Success');
    } catch (error) {
      return res.json({ error: 'Unknown error.' });
    }
  }
);

app.get(
  '/auth',
  passRoles(['user', 'moderator', 'admin']),
  authenticateToken,
  async (req, res) => {
    return res.json({ role: req.role });
  }
);

db.sequelize.sync().then(async () => {
  app.listen(3001, () => {
    console.log('Server initialization success');
  });

  try {
    await roles.create({ id: 1, name: 'user' });
    await roles.create({ id: 2, name: 'moderator' });
    await roles.create({ id: 3, name: 'admin' });

    bcrypt.hash('mod', 10, async (error, hash) => {
      await users.create({
        id: 1,
        name: 'mod',
        surname: 'mod',
        dateOfBirth: '1000-01-01',
        login: 'mod',
        password: hash,
        isDeleted: false,
        roleId: 2,
      });
    });

    bcrypt.hash('admin', 10, async (error, hash) => {
      await users.create({
        id: 2,
        name: 'admin',
        surname: 'admin',
        dateOfBirth: '1000-01-01',
        login: 'admin',
        password: hash,
        isDeleted: false,
        roleId: 3,
      });
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      console.log('Already created default values.');
    }
  }
});

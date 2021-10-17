const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const db = require('./models');
const { users } = require('./models');
const { authenticateToken } = require('./authenticateToken');

app.use(cors());
app.use(express.json());

const { UniqueConstraintError, DatabaseError } = require('sequelize');

app.get('/users/:page', authenticateToken, async (req, res) => {
  if (!req.params.page || isNaN(req.params.page) || req.params.page < 1) {
    return res.json({ error: 'Inavlid page number.' });
  }

  const limit = 10;
  const offset = (req.params.page - 1) * limit;

  try {
    let usersList = await users.findAndCountAll({
      attributes: ['id', 'name', 'surname', 'dateOfBirth', 'login'],
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
});

app.post('/loginUser', async (req, res) => {
  if (!req.body.login || !req.body.password) {
    return res.json({ error: 'Fill in all fields.' });
  }

  const user = await users.findOne({
    attributes: ['id', 'password'],
    where: { login: req.body.login, isDeleted: false },
  });

  if (!user) {
    return res.json({ error: 'Incorrect username or password.' });
  }

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
      const jwtToken = sign({ id: user.id }, 'SuperSecretKey', {
        expiresIn: '10h',
      });
      return res.json({ token: jwtToken });
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

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.json(err);
    } else {
      try {
        await users.create({
          ...req.body,
          password: hash,
          isDeleted: false,
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
    }
  });
});

app.put('/editUser', authenticateToken, async (req, res) => {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.dateOfBirth ||
    !req.body.login ||
    !req.body.id
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
});

app.delete('/deleteUser', authenticateToken, async (req, res) => {
  if (!req.body.id || isNaN(req.body.id) || req.body.id < 1) {
    return res.json({ error: 'Inavlid ID.' });
  }

  try {
    await users.update({ isDeleted: true }, { where: { id: req.body.id } });
    return res.json('Success');
  } catch (error) {
    return res.json({ error: 'Unknown error.' });
  }
});

app.get('/auth', authenticateToken, async (req, res) => {
  return res.json('Success');
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server initialization success');
  });
});

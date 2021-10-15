const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./models');
const { users } = require('./models');

app.use(cors());
app.use(express.json());

const { UniqueConstraintError, DatabaseError } = require('sequelize');

app.get('/users/:page', async (req, res) => {
  const limit = 10;
  const offset = req.params.page * limit;

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

  res.json(usersList);
});

app.post('/createUser', async (req, res) => {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.dateOfBirth ||
    !req.body.login ||
    !req.body.password
  ) {
    res.json({ error: 'Fill in all fields.' });
    return;
  }

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      res.json(err);
    } else {
      try {
        await users.create({
          ...req.body,
          password: hash,
          isDeleted: false,
        });
        res.json('Success');
      } catch (error) {
        console.log(error);
        if (error instanceof UniqueConstraintError) {
          res.json({ error: 'This username is unavailable.' });
        } else if (error instanceof DatabaseError) {
          res.json({ error: 'Check all fields.' });
        } else {
          res.json({ error: 'Unknown error.' });
        }
      }
    }
  });
});

app.put('/editUser', async (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const dateOfBirth = req.body.dateOfBirth;
  const login = req.body.login;
  try {
    await users.update(
      { name, surname, dateOfBirth, login },
      { where: { id: req.body.id } }
    );
    res.json('Success');
  } catch (error) {
    console.log(error);
    res.json('Failure');
  }
});

app.delete('/deleteUser', async (req, res) => {
  try {
    await users.update({ isDeleted: true }, { where: { id: req.body.id } });
    res.json('Success');
  } catch (error) {
    console.log(error);
    res.json('Failure');
  }
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server initialization success');
  });
});

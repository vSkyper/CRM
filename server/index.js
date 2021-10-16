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
  if (!req.params.page || isNaN(req.params.page) || req.params.page < 1) {
    res.json({ error: 'Inavlid page number.' });
    return;
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

    res.json(usersList);
  } catch (error) {
    res.json({ error: 'Unknown error.' });
  }
});

app.post('/loginUser', async (req, res) => {
  if (!req.body.login || !req.body.password) {
    res.json({ error: 'Fill in all fields.' });
    return;
  }

  const user = await users.findOne({
    attributes: ['password'],
    where: { login: req.body.login },
  });

  if (!user) {
    res.json({ error: "Incorrect username or password." });
    return;
  }

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result){
      res.json({success: 'Hurra!'})
    } else {
      res.json({error: 'Incorrect username or password.'})
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
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.dateOfBirth ||
    !req.body.login ||
    !req.body.id
  ) {
    res.json({ error: 'Fill in all fields.' });
    return;
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
    res.json('Success');
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.json({ error: 'This username is unavailable.' });
    } else if (error instanceof DatabaseError) {
      res.json({ error: 'Check all fields.' });
    } else {
      res.json({ error: 'Unknown error.' });
    }
  }
});

app.delete('/deleteUser', async (req, res) => {
  if (!req.body.id || isNaN(req.body.id) || req.body.id < 1) {
    res.json({ error: 'Inavlid ID.' });
    return;
  }

  try {
    await users.update({ isDeleted: true }, { where: { id: req.body.id } });
    res.json('Success');
  } catch (error) {
    res.json({ error: 'Unknown error.' });
  }
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server initialization success');
  });
});

const express = require('express');
const app = express();

const cors = require('cors');

const db = require('./models');
const { users } = require('./models');

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const usersList = await users.findAll();
  res.json(usersList);
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server initialization success');

    users.create({
      name: 'test_name',
      surname: 'test_surname',
      dateOfBirth: '1999-01-01',
      login: 'test_login',
      password: 'test_password',
      isDeleted: false,
    });
  });
});

const express = require('express');
const app = express();

const cors = require('cors');

const db = require('./models');
const { users } = require('./models');

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const usersList = await users.findAll({
    where: {
      isDeleted: false,
    },
  });
  res.json(usersList);
});

app.post('/createUser', async (req, res) => {
  await users.create({
    ...req.body,
    isDeleted: false,
  });
  res.json('Success');
});

app.delete('/deleteUser', async (req, res) => {
  await users.update({ isDeleted: true }, { where: { id: req.body.id } });
  res.json('Success');
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server initialization success');
  });
});

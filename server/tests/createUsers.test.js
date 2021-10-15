const axios = require('axios');
const faker = require('faker');

test('createUsers', () => {
  for (let i = 0; i < 3; i++) {
    const data = {
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      dateOfBirth: faker.date.between('1960-01-01', '2006-01-01'),
      login: 'hailey.sporer67',
      password: faker.internet.password(),
    };

    axios.post('http://localhost:3001/createUser', data);
  }
});

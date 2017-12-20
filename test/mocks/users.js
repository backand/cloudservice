var faker = require("faker");
var users = {
  registeredUser: { username: 'singhmohancs@gmail.com', password: 'mohan@123' },
  unRegisteredUser: { username: 'unRegisteredUser@gmail.com', password: 'mohan@123' },
  invalidUser: { username: 'unRegisteredUser', password: 'mohan@123' },
  getRandomUser: function () {
    return {
      name: 'Test User',
      username: 'testuser_' + faker.random.number(1000000000000) + '@example.com',
      password: 'test1234'
    }
  }
};

module.exports = users;

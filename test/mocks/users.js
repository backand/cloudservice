var faker = require("faker");
var users = {
  registeredUser: { username: 'singhmohancs@gmail.com', password: 'mohan@123' },
  unRegisteredUser: { username: 'unRegisteredUser@gmail.com', password: 'mohan@123' },
  invalidUser: { username: 'unRegisteredUser', password: 'mohan@123', name : 'Test User' },
  getRandomUser: function () {
    return {
      name: 'Test User',
      username: 'testuser_' + faker.random.number(1000000000000) + '@backand.io',
      password: 'test1234'
    }
  }
};

module.exports = users;

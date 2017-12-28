var faker = require("faker");
var users = {
  registeredUser: { username: 'mohan@backand.io', password: 'mohan@123' },
  unRegisteredUser: { username: 'mohan986@gmail.com', password: 'mohan@123' },
  invalidUser: { username: 'mohan', password: 'mohan@123', name : 'Test User' },
  getRandomUser: function () {
    return {
      name: 'Test User',
      username: 'testuser_' + faker.random.number(1000000000000) + '@backand.io',
      password: 'test1234'
    }
  }
};

module.exports = users;

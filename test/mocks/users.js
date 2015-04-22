var faker = require("faker");
var users = {
  registeredUser: {username: 'testuser@example.com', password: 'test1234'},
  getRandomUser: function() {
    return {
      name: 'Test User',
      username: 'testuser_' + faker.random.number(1000000000000) + '@example.com',
      password: 'test1234'}
  }
};

module.exports = users;

var faker = require("faker");
var apps = {
  getRandomApp: function() {
    return {name: 'domainfortests' + faker.random.number(1000000000000), title: faker.lorem.words()}
  },
  invalidApp: {name: '!@#$ sadf', title: 'Invalid App'},
  existingApp: {name: 'testexistingapp', title: 'Test Existing App'}
};

module.exports = apps;
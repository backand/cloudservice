var signUpPage = require('../pageObjects/signUpPage'),
  appsPage = require('../pageObjects/appsPage'),
  exampleDatabasePage = require('../pageObjects/exampleDatabasePage'),
  examplePlaygroundPage = require('../pageObjects/examplePlaygroundPage'),
  users = require('../../mocks/users'),
  validUser = users.getRandomUser(),
  invalidUser = users.invalidUser;;

xdescribe('signup', function () {
  beforeAll(function () {
    helpers.logout();
    browser.get('/#/sign_up');
  });

  it('should not allow to signup with invalid details', function () {
    signUpPage.setUser(invalidUser);
    expect(signUpPage.hooks.buttons.signupButton.isEnabled()).toBe(false);
  });


  it('should sign up a new user', function () {
    signUpPage.setUser(validUser);
    signUpPage.signUp();
    expect(browser.getCurrentUrl()).toBe( browser.baseUrl+'/#/');
  });
});

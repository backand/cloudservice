var signInPage = require('../pageObjects/signInPage'),
  apps = require('../../mocks/apps'),
  unRegisteredUser = require('../../mocks/users').unRegisteredUser,
  registeredUser = require('../../mocks/users').registeredUser,
  invalidUser = require('../../mocks/users').invalidUser;

xdescribe('SignIn app scenario', function () {
  beforeAll(function () {
    helpers.logout();
    browser.get(browser.baseUrl + '/#/sign_in');
  });

  it('should not allow to signin with invalid credentials', function () {
    signInPage.signIn(invalidUser);
    expect(signInPage.invalidEmail).toBePresent();
    expect(signInPage.errorPlaceholder).toBePresent();
  });

  it('should give error when login with incorrect credentials', function () {
    signInPage.signIn(unRegisteredUser);
    expect(signInPage.errorPlaceholder).toBePresent();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/sign_in');
  })

  it('should allow to signin with valid credentials', function () {
    signInPage.signIn(registeredUser);
    expect(signInPage.errorPlaceholder).not.toBePresent();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/');
  });
});
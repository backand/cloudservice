var signUpPage = require('../pageObjects/signUpPage');
var appsPage = require('../pageObjects/appsPage');
var exampleDatabasePage = require('../pageObjects/exampleDatabasePage');
var examplePlaygroundPage = require('../pageObjects/examplePlaygroundPage');

describe('signup', function () {
  beforeEach(function () {
    helpers.logout();
    browser.get(browser.baseUrl + '/#/sign_up');
  });

  it('should not allow to signup with invalid details', function () {
    signInPage.signIn(invalidUser);
    expect(signInPage.invalidEmail).toBePresent();
    expect(signInPage.errorPlaceholder).toBePresent();
  });


  it('should sign up a new user', function () {
    signUpPage.signUp();
    expect(appsPage.hooks.nameInput).toBeDisplayed();
  });

  it('should connect the example app', function () {
    /* expect(appsPage.hooks.getFirstPanelRibbon().getText()).toBe('Example');
     appsPage.actions.clickFirstPanelManageButton();
     expect(exampleDatabasePage.hooks.title).toBeDisplayed();*/
  });

});

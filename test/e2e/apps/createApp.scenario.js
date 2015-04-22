var signInPage = require('../pageObjects/signInPage');
var appsPage = require('../pageObjects/appsPage');
var apps = require('../../mocks/apps');
var databaseEditPage = require('../pageObjects/databaseEditPage');

var app;
var invalidApp = apps.invalidApp;
var existingApp = apps.existingApp;

describe('create app scenario', function() {
  beforeEach(function () {
    signInPage.ensureSignedIn();
    app = apps.getRandomApp();
    browser.ignoreSynchronization = false;
  });

  it('should allow to create a valid app', function () {
    appsPage.newApp.create(app);
    // TODO: expect success notification
    expect(databaseEditPage.hooks.title).toBeDisplayed();

    databaseEditPage.actions.createCustomDatabase().then(function() {
      browser.ignoreSynchronization = true;
      expect(element(by.testHook('docs.quickstart.title'))).toBeDisplayed();
    }).then(function () {
      browser.ignoreSynchronization = false;
    });
  });
});

describe('create invalid app scenario', function() {
  beforeEach(function() {
    signInPage.ensureSignedIn();
  });

  it('should not allow to create invalid apps', function() {
    expect(appsPage.hooks.createButton).toBeDisabled();

    appsPage.newApp.fillIn(invalidApp);
    expect(appsPage.hooks.createButton).toBeDisabled();

    expect(appsPage.hooks.errorLabel).toBeDisplayed();

    appsPage.newApp.fillIn(existingApp);
    expect(appsPage.hooks.errorLabel).not.toBeDisplayed();
    expect(appsPage.hooks.createButton).not.toBeDisabled();
  });

});

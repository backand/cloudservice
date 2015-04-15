var signInPage = require('../pageObjects/signInPage');
var appsPage = require('../pageObjects/appsPage');
var apps = require('../../mocks/apps');
var databaseEditPage = require('../pageObjects/databaseEditPage');

var app;
var invalidApp = apps.invalidApp;
var existingApp = apps.existingApp;

describe('create app scenario', function() {
  beforeEach(function() {
    signInPage.ensureSignedIn();
    app = apps.getRandomApp();
  });

  it('should allow to create a valid app', function() {
    appsPage.newApp.create(app);
    // TODO: expect success notification
    expect(databaseEditPage.title.isDisplayed()).toBeTruthy();
  });

  it('should not allow to create invalid apps', function() {
    expect(appsPage.newApp.createButton).toBeDisabled();
    
    appsPage.newApp.fillIn(invalidApp);
    expect(appsPage.newApp.createButton).toBeDisabled();
    
    expect(appsPage.newApp.errorLabel).toBeDisplayed();

    appsPage.newApp.fillIn(existingApp);
    expect(appsPage.newApp.errorLabel).not.toBeDisplayed();
    expect(appsPage.newApp.createButton).not.toBeDisabled();

    appsPage.newApp.createButton.click();
    // TODO: expect error notification
  });

});
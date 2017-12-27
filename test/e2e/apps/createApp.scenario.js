var signInPage = require('../pageObjects/signInPage');
var appsPage = require('../pageObjects/appsPage');
var apps = require('../../mocks/apps');
var databaseEditPage = require('../pageObjects/databaseEditPage');

var app;
var invalidApp = apps.invalidApp;
var existingApp = apps.existingApp;

xdescribe('create app scenario', function () {
  beforeEach(function () {
    helpers.logout();
    signInPage.ensureSignedIn();
    app = apps.getRandomApp();
    browser.ignoreSynchronization = false;
  });

  it('should allow to create a valid app', function () {
    var externalFnUrl = browser.baseUrl + '/#/app/' + app.name + '/functions/external-functions';
    appsPage.newApp.create(app);
    expect(browser.getCurrentUrl()).toBe(externalFnUrl);
  });

  it('should not allow to create invalid apps', function () {
    appsPage.hooks.newAppBtn.click();
    expect(appsPage.hooks.createButton.isEnabled()).toBe(false);

    appsPage.newApp.fillIn(invalidApp);
    expect(appsPage.hooks.createButton.isEnabled()).toBe(false);
    expect(appsPage.hooks.errorLabel).toBeDisplayed();
    appsPage.newApp.fillIn(existingApp);
    expect(appsPage.hooks.errorLabel).not.toBeDisplayed();
    expect(appsPage.hooks.createButton).not.toBe(true);
  });
});
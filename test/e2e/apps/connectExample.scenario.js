var signUpPage = require('../pageObjects/signUpPage');
var appsPage = require('../pageObjects/appsPage');
var exampleDatabasePage = require('../pageObjects/exampleDatabasePage');
var examplePlaygroundPage = require('../pageObjects/examplePlaygroundPage');

describe('new user and example app scenario', function() {

  it('should sign up a new user', function() {
    signUpPage.signUp();
    // TODO: expect success notification
    expect(appsPage.hooks.nameInput).toBeDisplayed();
  });

  it('should connect the example app', function() {
    expect(appsPage.hooks.getFirstPanelRibbon()).toHaveText('Example');

    appsPage.actions.clickFirstPanelManageButton();
    expect(exampleDatabasePage.hooks.title).toBeDisplayed();

    exampleDatabasePage.actions.connectToDatabase().then(function() {
      browser.ignoreSynchronization = true;
      expect(examplePlaygroundPage.hooks.title).toBeDisplayed();
      expect(examplePlaygroundPage.hooks.iframeSubstitute).toBeDisplayed();
    }).then(function () {
      browser.ignoreSynchronization = false;
    });

    // TODO: expect error notification
  });

});/**
 * Created by shmuela on 19/04/15.
 */

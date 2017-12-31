var registeredUsersPage = require('../pageObjects/registeredUsersPage'),
  unRegisteredUser = require('../../mocks/users').unRegisteredUser,
  registeredUser = require('../../mocks/users').registeredUser,
  invalidUser = require('../../mocks/users').invalidUser
signInPage = require('../pageObjects/signInPage');

var selectedApp;

describe('Invite user:', function () {
  beforeAll(function () {
    helpers.logout();
    browser.get(browser.baseUrl + '/#/sign_in');
    signInPage.signIn(registeredUser);
  });

  it('should select an app', function () {
    registeredUsersPage.hooks.links.appsList.first().$('.app-name span').getText().then(function (text) {
      selectedApp = text;
    });
    expect(registeredUsersPage.hooks.links.appsList.count()).toBe(1)
    registeredUsersPage.hooks.links.appsList.first().$('.manage-apps').click();
    registeredUsersPage.hooks.links.security.click();
    expect(registeredUsersPage.hooks.links.security.getAttribute('class')).toContain('active');
  });

  it('should select registered users page', function () {
    registeredUsersPage.hooks.links.security.click();
    expect(registeredUsersPage.hooks.links.security.getAttribute('class')).toContain('active');
    registeredUsersPage.hooks.links.registeredUser.click();
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + '/#/app/' + selectedApp + '/security/users');
  });

  it('should invite user section be present & enabled', function () {
    let isEnabledInput = registeredUsersPage.hooks.elements.inviteUserContainer.$('tags-input input').isEnabled();
    expect(registeredUsersPage.hooks.elements.inviteUserContainer.isPresent()).toBeTruthy();
    expect(registeredUsersPage.hooks.elements.inviteAdminContainer.isPresent()).toBeFalsy();
    expect(isEnabledInput).toBe(true);
    isEnabledInput.then(function (enabled) {
      if (enabled) {
        helpers.fillInput(registeredUsersPage.hooks.elements.inviteUserContainer.$('tags-input input'), 'singhmohancs');
        expect(registeredUsersPage.hooks.buttons.btnInviteUser.isEnabled()).toBeFalsy();
        helpers.fillInput(registeredUsersPage.hooks.elements.inviteUserContainer.$('tags-input input'), 'singhmohancs@gmail.com');
        registeredUsersPage.hooks.elements.inviteUserContainer.$('tags-input input').sendKeys(protractor.Key.ENTER);
        expect(registeredUsersPage.hooks.buttons.btnInviteUser.isEnabled()).toBeTruthy();
        registeredUsersPage.hooks.buttons.btnInviteUser.click();
      }
    })
  });

});
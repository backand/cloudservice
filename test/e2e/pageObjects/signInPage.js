'use strict';
var registeredUser = require('../../mocks/users').registeredUser;

function SignInPage() {
  this._init = function () {
    this.usernameInput = element(by.testHook('signin.username'));
    this.passwordInput = element(by.testHook('signin.password'));
    this.loginButton = element(by.testHook('signin.login'));
    this.errorPlaceholder = element(by.testHook('signin.errorPlaceholder'));
    this.invalidEmail = element(by.testHook('signin.invalidEmail'));
  };

  this.signIn = function (user) {
    if (user.username) helpers.fillInput(this.usernameInput, user.username);
    if (user.password) helpers.fillInput(this.passwordInput, user.password);
    this.loginButton.click();
  };

  this.ensureSignedIn = function () {
    var self = this;
    browser.get('/#/sign_in');
    browser.getCurrentUrl().then(function (url) {
      if (url.indexOf('sign_in') != -1) {
        self.signIn(registeredUser);
      }
    });
  };

  this._init();
}

module.exports = new SignInPage();
'use strict';
var users = require('../../mocks/users');
var user = users.getRandomUser();

function SignUpPage() {
  var self = this;

  self.hooks = {
    nameInput: element(by.testHook('signup.name')),
    emailInput: element(by.testHook('signup.email')),
    passwordInput: element(by.testHook('signup.password')),
    passwordConfirmInput: element(by.testHook('signup.password-confirm')),
    signupButton: element(by.testHook('signup.signup'))
  };

  self.signUp = function() {
    browser.get('/#/sign_up');
    if (user.name) helpers.fillInput(self.hooks.nameInput, user.name);
    if (user.username) helpers.fillInput(self.hooks.emailInput, user.username);
    if (user.password) {
      helpers.fillInput(self.hooks.passwordInput, user.password);
      helpers.fillInput(self.hooks.passwordConfirmInput, user.password);
    }
    self.hooks.signupButton.click();
  };

}

module.exports = new SignUpPage();

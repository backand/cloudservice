'use strict';
var users = require('../../mocks/users');

function SignUpPage() {
  var self = this;

  self.hooks = {
    fields: {
      fullName: element(by.testHook('signup.name')),
      email: element(by.testHook('signup.email')),
      password: element(by.testHook('signup.password')),
      passwordConfirm: element(by.testHook('signup.password-confirm'))
    },
    errors: {
      email: {
        invalid: element(by.testHook('signup.invalidEmail'))
      },
      password: {
        mismatch: element(by.testHook('signup.mismatchPassword'))
      },
      global: {
        server: element(by.testHook('signup.error'))
      }
    },
    buttons: {
      signupButton: element(by.testHook('signup.signup'))
    }
  };

  self.signUp = function () {
    self.hooks.buttons.signupButton.click();
  };

  self.setUser = function (u) {
    if (u.name) helpers.fillInput(self.hooks.fields.fullName, u.name);
    if (u.username) helpers.fillInput(self.hooks.fields.email, u.username);
    if (u.password) {
      helpers.fillInput(self.hooks.fields.password, u.password);
      helpers.fillInput(self.hooks.fields.passwordConfirm, u.password);
    }
  };


}

module.exports = new SignUpPage();

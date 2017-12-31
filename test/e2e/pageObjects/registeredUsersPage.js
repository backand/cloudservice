'use strict';
var users = require('../../mocks/users');

function registeredUsersPage() {
  var self = this;

  self.hooks = {
    fields: {
      emails: element(by.model('newTag.text')),
    },
    errors: {
      pageErros: element(by.id('toast-container')),
    },
    buttons: {
      btnInviteUser: element(by.testHook('btnInviteUser'))
    },
    links: {
      security: element(by.testHook('linkSecurity')),
      registeredUser: element(by.testHook('linkRegisteredUsers')).$('a'),
      appsList: $$('.apps-container .apps-item'),
    },
    elements: {
      inviteUserContainer: $('.invite-user-container'),
      inviteAdminContainer : $('.invite-admin-container')
    }
  };
}

module.exports = new registeredUsersPage();

(function () {

  function SecurityController() {

    var self = this;

    self.sTemplate = [
      {
        title: 'Admin',
        permissions: {
          read: true,
          write: false,
          edit: true,
          delete: false
        }
      },

      {
        title: 'User',
        permissions: {
          read: true,
          write: false,
          edit: false,
          delete: false
        }
      }
    ]

  }

  angular.module('app')
    .controller('SecurityController', SecurityController);
}());

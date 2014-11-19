(function() {
  'use strict';

  function SessionService($rootScope, $cookieStore) {
    var self = this;

    this.currentUser = $cookieStore.get('globals') ? $cookieStore.get('globals').currentUser : undefined;

    this.getAuthHeader = function() {
      if (!self.currentUser) {
        return false
      }
      return 'bearer ' + self.currentUser.access_token;
    };

    this.setCredentials = function (serverData) {
      var user = {
        currentUser: {
          access_token : serverData.access_token
        }
      };

      self.currentUser = user.currentUser;
      
      $cookieStore.put('globals', user);
    };

    this.ClearCredentials = function () {
      $cookieStore.remove('globals');
      self.currentUser = undefined;
    };
  }

  angular.module('common.services', ['ngCookies'])
    .service('SessionService', ['$rootScope', '$cookieStore', SessionService])
})();

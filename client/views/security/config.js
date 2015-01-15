(function() {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('security.users', {
        url: '/users/:name',
        controller: 'SecurityUsers as users',
        templateUrl: 'views/security/user/users.html'
      })
      .state('security.roles', {
        url: '/users/:name',
        controller: 'SecurityRoles as roles',
        templateUrl: 'views/security/role/roles.html'
      })
      .state('security.auth', {
        url: '/users/:name',
        controller: 'SecurityAuth as auth',
        templateUrl: 'views/security/auth/auth.html'
      })
  }

})();

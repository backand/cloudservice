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
      .state('security.workspace', {
        url: '/workspaces/:name',
        controller: 'SecurityWorkspace as workspaces',
        templateUrl: 'views/security/workspace/workspace.html'
      })
      .state('security.auth', {
        url: '/auth/:name',
        controller: 'SecurityAuth as auth',
        templateUrl: 'views/security/auth/auth.html'
      })
  }

})();

(function() {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('security.users', {
        url: '/users/:name',
        controller: 'SecurityUsers as users',
        templateUrl: 'views/security/users.html'
      })
  }

})();

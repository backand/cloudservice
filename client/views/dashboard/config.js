(function() {
  'use strict';

  angular.module('app.dashboard', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('dashboard.edit', {
        parent: 'dashboard',
        url: '/:name',
        controller: 'Dashboard as dash',
        templateUrl: 'views/dashboard/dashboard.html'
      })
  }
})();

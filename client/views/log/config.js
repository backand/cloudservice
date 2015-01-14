(function() {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('log.config', {
        url: '/config/:name',
        controller: 'LogConfig as log',
        templateUrl: 'views/log/log.html'
      })
      .state('log.history', {
        url: '/history/:name',
        controller: 'LogConfig as log',
        templateUrl: 'views/log/log.html'
      })
      .state('log.exception', {
        url: '/exception/:name',
        controller: 'LogActivity as log',
        templateUrl: 'views/log/activity.html'
      })
  }

})();

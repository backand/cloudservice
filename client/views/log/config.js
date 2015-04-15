(function() {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('log.config', {
        url: '/config',
        controller: 'LogConfig as log',
        templateUrl: 'views/log/log.html'
      })
      .state('log.history', {
        url: '/history',
        controller: 'LogConfig as log',
        templateUrl: 'views/log/log.html'
      })
      .state('log.exception', {
        url: '/exception',
        controller: 'LogActivity as log',
        templateUrl: 'views/log/activity.html'
      })
  }

})();

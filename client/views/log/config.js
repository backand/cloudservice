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
        url: '/exception?q',
        controller: 'RequestsLog as vm',
        templateUrl: 'views/log/requests.html'
      })
      .state('log.console', {
        url: '/console?q',
        controller: 'RequestsLog as vm',
        templateUrl: 'views/log/requests.html'
      })
      .state('log.requests', {
        url: '/requests?q',
        controller: 'RequestsLog as vm',
        templateUrl: 'views/log/requests.html'
      })
  }

})();

(function() {

  'use strict';

  angular.module('backand.apps', ['services'])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('apps.index', {
        url: '',
        controller: 'AppsIndexController as index',
        templateUrl: 'views/apps/index.tpl.html',
        resolve: {
          appsList: ['AppsService', function (AppsService) {
            return AppsService.all();
          }]
        }
      })
      .state('app.show', {
        url: '/',
        controller: 'AppShowController as show',
        templateUrl: 'views/apps/show.tpl.html'
      })
      .state('app.edit', {
        url: '/settings',
        controller: 'AppSettings as settings',
        templateUrl: 'views/apps/settings.html'
      })
  }
})();

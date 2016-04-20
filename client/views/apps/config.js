(function () {

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
        },
        params: {
          'deletedApp': ''
        }
      })
      .state('apps.parse', {
        url: 'parse',
        controller: 'AppsIndexController as index',
        templateUrl: 'views/apps/index.tpl.html',
        resolve: {
          appsList: ['AppsService', function (AppsService) {
            return AppsService.all();
          }]
        },
        params: {
          'deletedApp': ''
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
      .state('app.configuration', {
        url: '/configuration',
        controller: 'AppConfiguration as configuration',
        templateUrl: 'views/apps/configuration.html'
      })
      .state('apps.create', {
        url: 'create',
        abstract: true
      })
      .state('apps.platform_select', {
        url: 'platform_select',
        controller: 'PlatformSelectController as platform',
        templateUrl: 'views/apps/app_creation/platform_select.html'
      })
      .state('apps.starter_app_select', {
        url: 'starter_app?platform',
        controller: 'StarterAppSelectController as starterApp',
        templateUrl: 'views/apps/app_creation/starter_app_select.html',
        params: {
          platformName: 'RESTful API'
        }
      })
  }
})();

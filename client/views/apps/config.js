'use strict';

angular.module('app.apps', ['services'])
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
    .state('apps.show', {
      url: ':name',
      controller: 'AppsShowController as show',
      templateUrl: 'views/apps/show.tpl.html',
      resolve: {
        appItem: ['AppsService', '$stateParams', function (AppsService, stateParams) {
          return AppsService.find(stateParams.name);
        }]
      }
    })
}

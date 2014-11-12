'use strict';

angular.module('app.apps', ['services'])
  .config(config);

function config($stateProvider) {
  $stateProvider
    .state('apps.index', {
      url: '',
      controller: 'AppsIndexController as index',
      templateUrl: 'views/apps/index.tpl.html',
      resolve:{
        appsList: ['AppsService',function(AppsService){
          return AppsService.all();
        }]
      }
    })
    .state('apps.show', {
      url: '/:name',
      controller: 'AppsShowController as show',
      templateUrl: 'views/apps/show.tpl.html',
      resolve:{
        appItem: ['AppsService','$stateParams',function(AppsService,stateParams){
          return AppsService.find(stateParams.name);
        }]
      }
    })
    .state('apps.data', {
      url: '/:name/data-base',
      controller: 'AppsDataController as data',
      templateUrl: 'views/apps/data_base.html'
    })
    .state('apps.data.new-source', {
      url: '',
      //controller: 'AppsDataController as data',
      templateUrl: 'views/apps/data_base_new_source.html'
    })
    .state('apps.data.exs-source', {
      url: '',
      //controller: 'AppsDataController as data',
      templateUrl: 'views/apps/data_base_exs_source.html'
    })
}

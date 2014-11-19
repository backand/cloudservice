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
      url: '/:name',
      controller: 'AppsShowController as show',
      templateUrl: 'views/apps/show.tpl.html',
      resolve: {
        appItem: ['AppsService', '$stateParams', function (AppsService, stateParams) {
          return AppsService.find(stateParams.name);
        }]
      }
    })
    .state('apps.data', {
      url: '/:name/data-base',
      controller: 'AppsDataController as data',
      templateUrl: 'views/database/database.html'
    })
    .state('apps.info', {
      url: '/:name/info/:data',
      controller: 'DatabaseInfo as info',
      templateUrl: 'views/database/info/database_info.html'
    })
    .state('apps.data.new-source', {
      url: '/new',
      templateUrl: 'views/database/new_data/database_new_source.html'
    })
    .state('apps.data.new-source.form', {
      url: '/form/:data',
      controller: 'dataBaseNewSource as nsource',
      templateUrl: 'views/database/new_data/database_new_source_form.html'
    })
    .state('apps.data.exs-source', {
      url: '/exiting',
      controller: 'dataBaseExsSource as ex',
      templateUrl: 'views/database/exs_data/database_exs_source.html',
    })
    .state('apps.data.exs-source.form', {
      url: '/form/:data',
      controller: 'dataBaseExsSourceForm as exsource',
      templateUrl: 'views/database/exs_data/database_exs_source_form.html'
    })
};

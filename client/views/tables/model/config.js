(function () {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('json_model', {
        parent: 'tables.model',
        url: '/json',
        controller: 'JsonModelController as jsonModel',
        templateUrl: 'views/tables/model/json_model/json_model.html'
      })
      .state('erd_model', {
        parent: 'tables.model',
        url: '/erd',
        controller: 'ErdModelController as erdModel',
        templateUrl: 'views/tables/model/erd_model/erd_model.html',
        params: {
          tableName: '',
          isNewObject: ''
        }
      })
      .state('database_model', {
        parent: 'tables.model',
        url: '/database',
        controller: 'DatabaseModelController as database',
        templateUrl: 'views/tables/model/database/database.html'
      })
  }
})();

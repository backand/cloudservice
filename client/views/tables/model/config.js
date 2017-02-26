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
      .state('external_db_mod', {
        parent: 'tables.model',
        url: '/external_db_mod',
        controller: 'ExternalDbModController as externalDbMod',
        templateUrl: 'views/tables/model/external_db_mod/external_db_mod.html'
      })
  }
})();

(function () {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tables.notables', {
        url: '/sync',
        controller: 'TablesShow as tables',
        templateUrl: 'views/tables/no_tables.html',
        params: {
          sync: false
        }
      })
      .state('tables.model', {
        url: '/model',
        abstract: true,
        controller: 'ModelController as Model',
        templateUrl: 'views/tables/model/model.html'
      })
      .state('tables.columns', {
        url: '/:tableId',
        controller: 'SingleTableShow as singleTable',
        templateUrl: 'views/tables/show_single_table.html',
        abstract: true,
        resolve: {
          tableName: function (TablesService, RulesService, ColumnsService, DictionaryService, $stateParams, $q) {
            return TablesService.get($stateParams.appName)
            .then(function(tables) {
              var tableName = TablesService.getTableNameById(tables, $stateParams.tableId).name;
              // TODO: make sure services get the table name as param, not storing it in state
              RulesService.tableName = ColumnsService.tableName = DictionaryService.tableName = tableName;
              return tableName;
            }, function(error) {
              return $q.reject(error);
            });
          }
        }
      })
      .state('object_fields', {
        url: '/fields',
        parent: 'tables.columns',
        templateUrl: 'views/tables/fields/fields.html',
        controller: 'FieldsController as fields'
      })
      .state('object_actions', {
        parent: 'tables.columns',
        url: '/actions/{actionId}/{test}',
        templateUrl: 'views/tables/rules/rules.html',
        params: {
          line: null,
          col: null,
          q: null
        }
      })
      .state('object_security', {
        url: '/security',
        parent: 'tables.columns',
        templateUrl: 'views/tables/security/security.html',
        controller: 'SecurityController as security'
      })
      .state('object_settings', {
        url: '/settings',
        parent: 'tables.columns',
        templateUrl: 'views/tables/settings/settings.html',
        controller: 'FieldsController as fields'
      })
      .state('object_data', {
        url: '/data?collection',
        parent: 'tables.columns',
        templateUrl: 'views/tables/data/data.html',
        controller: 'ObjectDataController as ObjectData',
        params: {
          showLog: true,
          collection: false,
          defaultFilter: null
        }
      })
      .state('object_restapi', {
        url: '/restapi',
        parent: 'tables.columns',
        templateUrl: 'views/tables/restapi/restapi.html',
        controller: 'RestAPITab as rest'
      });
  }

})();

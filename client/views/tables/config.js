(function () {
  'use strict';

  angular.module('backand')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tables.notables', {
        url: '/sync',
        controller: 'TablesShow as tables',
        templateUrl: 'views/tables/no_tables.html'
      })
      .state('tables.model', {
        url: '/model',
        controller: 'ModelController as Model',
        templateUrl: 'views/tables/model.html'
      })
      .state('tables.columns', {
        url: '/:tableId',
        controller: 'SingleTableShow as singleTable',
        templateUrl: 'views/tables/show_single_table.html',
        abstract: true,
        resolve: {
          tableName: function (TablesService, RulesService, ColumnsService, DictionaryService, $stateParams) {
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
      .state('tables.columns.fields', {
        url: '/fields',
        templateUrl: 'views/tables/fields/fields.html',
        controller: 'FieldsController as fields'
      })
      .state('tables.columns.actions', {
        url: '/actions',
        templateUrl: 'views/tables/rules/rules.html'
      })
      .state('tables.columns.security', {
        url: '/security',
        templateUrl: 'views/tables/security/security.html',
        controller: 'SecurityController as security'
      })
      .state('tables.columns.settings', {
        url: '/settings',
        templateUrl: 'views/tables/settings/settings.html',
        controller: 'FieldsController as fields'
      })
      .state('tables.columns.data', {
        url: '/data',
        templateUrl: 'views/tables/data/data.html',
        controller: 'ObjectDataController as ObjectData'
      })
      .state('tables.columns.restapi', {
        url: '/restapi',
        templateUrl: 'views/tables/restapi/restapi.html',
        controller: 'RestAPITab as rest'
      });
  }

})();

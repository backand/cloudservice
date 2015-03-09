(function () {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tables.notables', {
        url: '/sync/:name',
        controller: 'TablesShow as tables',
        templateUrl: 'views/tables/no_tables.html'
      })
      .state('tables.columns', {
        url: '/:name/:tableId',
        controller: 'SingleTableShow as singleTable',
        templateUrl: 'views/tables/show_single_table.html',
        abstract: true,
        resolve: {
          tableName: function (TablesService, RulesService, ColumnsService, DictionaryService, $stateParams) {
            return TablesService.get($stateParams.name)
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
        templateUrl: 'views/tables/rules/rules.html',
        controller: 'RulesController as rules'
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
        controller: 'ViewData as data'
      })
      .state('tables.columns.log', {
        url: '/log',
        templateUrl: 'views/tables/log/log.html'
      });
  }

})();

(function() {
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
        templateUrl: 'views/tables/show_single_table.html'


      })
  }

})();

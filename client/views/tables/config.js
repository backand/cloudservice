(function() {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tables.show', {
        url: '/:name',
        controller: 'TablesShow as tables',
        templateUrl: 'views/tables/show.html'
      })
      .state('tables.columns', {
        url: '/:name/:tableName',
        controller: 'SingleTableShow as singleTable',
        templateUrl: 'views/tables/show_single_table.html'
      })
  }

})();

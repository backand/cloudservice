(function() {
  'use strict';

  angular.module('app.dbQueries', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('dbQueries.newQuery', {
        url: '/:name/new',
        controller: 'DbQueryController as DbQuery',
        templateUrl: 'views/db_queries/query.html'
      })
      .state('dbQueries.query', {
        url: '/:name/:queryId',
        controller: 'DbQueryController as DbQuery',
        templateUrl: 'views/db_queries/query.html'
      })

  }

})();

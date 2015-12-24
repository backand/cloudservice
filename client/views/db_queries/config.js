(function() {
  'use strict';

  angular.module('backand.dbQueries', [])
    .config(config);

  function config($stateProvider) {
        $stateProvider
        .state('dbQueries.newQuery', {
            url: '/new',
            controller: 'DbQueryController as DbQuery',
            templateUrl: 'views/db_queries/query.html'
        })
        .state('dbQueries.query', {
            url: '/:queryId',
            controller: 'DbQueryController as DbQuery',
            templateUrl: 'views/db_queries/query.html'
        })
        .state('dbQueries.newSavedQuery', {
            url: '/new/:queryId',
            controller: 'DbQueryController as DbQuery',
            templateUrl: 'views/db_queries/query.html'
        });

  }

})();

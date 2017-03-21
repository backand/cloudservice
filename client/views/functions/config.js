(function() {
  'use strict';

  angular.module('backand.functions', [])
    .config(config);

  function config($stateProvider) {
        $stateProvider
        .state('functions.newFunction', {
            url: '/new',
            controller: 'DbQueryController as DbQuery',
            templateUrl: 'views/db_queries/query.html'
        })
        .state('functions.function', {
            url: '/functions/:functionId',
            controller: 'Functions as actions',
            templateUrl: 'views/functions/functions.html'
        })


  }

})();

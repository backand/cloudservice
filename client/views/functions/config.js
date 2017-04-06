(function() {
  'use strict';

  angular.module('backand.functions', [])
    .config(config);

  function config($stateProvider) {
        $stateProvider
        .state('functions.newjsfunctions', {
            url: '/new_javascript',
            controller: 'FunctionsController as functionsCon',
            templateUrl: 'views/functions/jsfunctions.html'
        })
        .state('functions.newlambdafunctions', {
            url: '/new_lambda',
            controller: 'FunctionsController as functionsCon',
            templateUrl: 'views/functions/lambdafunctions.html'
        })
        .state('functions.function', {
            url: '/function/:functionId/{test}',
            controller: 'FunctionsController as functionsCon',
            templateUrl: 'views/functions/functions.html'
        });

  }

})();

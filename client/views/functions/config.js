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
        .state('functions.newlambadafunctions', {
            url: '/new_lambada',
            controller: 'FunctionsController as functionsCon',
            templateUrl: 'views/functions/lambadafunctions.html'
        });

  }

})();

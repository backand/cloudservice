(function() {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tables.show', {
        url: '/:name?:sync',
        controller: 'TablesShow as tables',
        templateUrl: 'views/tables/show.html'
      })
    .state('tables.temp', {
        url: '/temp/:name?:sync',
        controller: 'TablesShow as tables',
        templateUrl: 'views/tables/temp.html'
    })
  }

})();

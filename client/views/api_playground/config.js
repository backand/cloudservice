(function() {

  'use strict';

  angular.module('app.playground', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('playground.show', {
        parent: 'playground',
        url: '/:name',
        controller: 'Playground as play',
        templateUrl: 'views/api_playground/show.html'
      })
  }

})();

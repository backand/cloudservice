(function() {

  'use strict';

  angular.module('app.playground', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('playground.get-started', {
        parent: 'playground',
        url: '/docs/start/:name',
        templateUrl: 'views/api_playground/get-started.html'
      })
      .state('playground.get-started-open', {
        parent: 'playground',
        url: '/docs/start/:name',
        templateUrl: 'views/api_playground/get-started-open.html'
      })
      .state('playground.show', {
        parent: 'playground',
        url: '/rest/:name',
        controller: 'Playground as play',
        templateUrl: 'views/api_playground/show.html'
      })
      .state('playground.orm', {
        parent: 'playground',
        url: '/orm/:name',
        controller: 'Playground as play',
        templateUrl: 'views/api_playground/orm.html'
      })
      .state('playground.orm-config', {
        parent: 'playground',
        url: '/orm/config/:name',
        templateUrl: 'views/api_playground/orm-config.html'
      })
      .state('playground.orm-usage', {
        parent: 'playground',
        url: '/orm/usage/:name',
        templateUrl: 'views/api_playground/orm-usage.html'
      })

  }

})();

(function() {

  'use strict';

  angular.module('backand.playground', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('playground.show', {
        url: '/rest',
        controller: 'Playground as play',
        templateUrl: 'views/api_playground/show.html'
      })
      .state('playground.orm', {
        url: '/orm',
        controller: 'Playground as play',
        templateUrl: 'views/api_playground/orm.html'
      })
      .state('playground.orm-config', {
        url: '/orm/config',
        templateUrl: 'views/api_playground/orm-config.html'
      })
      .state('playground.orm-usage', {
        url: '/orm/usage',
        templateUrl: 'views/api_playground/orm-usage.html'
      })
      .state('playground.todo', {
        url: '/todo',
        controller: 'TodoCtrl as todo',
        templateUrl: 'views/api_playground/todo.html'
      })
  }

})();

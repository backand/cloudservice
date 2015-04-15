(function() {
  'use strict';

  angular.module('backand.database', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('database.example', {
        url: '/example',
        controller: 'DatabaseTodoExample as dbtodo',
        templateUrl: 'views/database/todo_example.html'
      })
      .state('database.show', {
        url: '',
        controller: 'DatabaseShow as dbshow',
        templateUrl: 'views/database/show.html'
      })
      .state('database.edit', {
        url: '/edit',
        controller: 'DatabaseEdit as dbedit',
        templateUrl: 'views/database/edit.html'
      })
  }

})();

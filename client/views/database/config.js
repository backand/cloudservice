(function() {
  'use strict';

  angular.module('app.database', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('database.todo-example', {
        url: '/todo-example',
        controller: 'DatabaseTodoExample as dbtodo',
        templateUrl: 'views/database/todo_example.html'
      })
      .state('database.show', {
        url: '/:name',
        controller: 'DatabaseShow as dbshow',
        templateUrl: 'views/database/show.html'
      })
      .state('database.edit', {
        url: '/:name/edit',
        controller: 'DatabaseEdit as dbedit',
        templateUrl: 'views/database/edit.html'
      })
      .state('database.add-tables', {
        url: '/template/:name',
        controller: 'TablesAdd as dbadd',
        templateUrl: 'views/database/add.html'
      })

  }

})();

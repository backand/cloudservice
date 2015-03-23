(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseTodoExample', ['$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', '$http', 'AuthService', DatabaseTodoExample]);

  function DatabaseTodoExample($state, DatabaseNamesService, NotificationService, DatabaseService, $http, AuthService) {

    var self = this;

    (function init() {
      self.appName = 'todo' + AuthService.getUserId();
      self.loading = false;
      $http({
        method: 'GET',
        url: '/examples/todo/database.json'
      })
        .then(function (result) {
          self.generatorCode = angular.toJson(result.data, true);
        });
    }());

    self.create = function () {
      self.loading = true;
      var product = DatabaseNamesService.getNumber("newMysql");

      DatabaseService.createDB(self.appName, product, 'todo-mysql')
      .success(function () {
          NotificationService.add('info', 'Creating new database... It may take 1-2 minutes');
          $state.go('getting-started-open', {isnew: 'new'});
      })
      .error(function (err) {
          self.loading = false;
          NotificationService.add('error', err)
      })
    };

  }
}());

(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseTodoExample', ['$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', '$http', DatabaseTodoExample]);

  function DatabaseTodoExample($state, DatabaseNamesService, NotificationService, DatabaseService, $http) {

    var self = this;

    (function init() {
      self.appName = 'todo_1212';
      self.loading = false;
      $http({
        method: 'GET',
        url: '/examples/todo/database.json'
      })
        .then(function (result) {
          self.generatorCode = angular.toJson(result.data, true);
        });
    }());

      self.create = function(){
        self.loading = true;
        var product = DatabaseNamesService.getNumber("newMysql");

        var sampleApp = "Todo-MySql";

        DatabaseService.createDB(self.appName, product, sampleApp)
        .success(function(data){
          NotificationService.add('info','Creating new database... It may take 1-2 minutes');
          $state.go('getting-started-open', {isnew: 'new'});
        })
        .error(function(err){
            self.loading = false;
            NotificationService.add('error', err)
        })
    };

  }
}());

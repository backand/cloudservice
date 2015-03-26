(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseTodoExample', ['$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', '$http', 'AuthService','$scope', DatabaseTodoExample]);

  function DatabaseTodoExample($state, DatabaseNamesService, NotificationService, DatabaseService, $http, AuthService,$scope) {

    var self = this;

    (function init() {
      //self.appName = 'todo' + AuthService.getUserId();
      self.appName = $state.params.name;
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

      var sampleApp = "todo-mysql";

      DatabaseService.createDB(self.appName, product, sampleApp)
        .success(function(data){
          NotificationService.add('info','Creating new database... It may take 1-2 minutes');
          $state.go('playground.todo', {name: self.appName, isnew: 'new'});
        })
        .error(function(err){
          self.loading = false;
          NotificationService.add('error', err)
        })
    };

    $scope.ace = {
      dbType: 'json',
      editors: {},
      onLoad: function(_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

  }
}());

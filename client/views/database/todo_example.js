(function  () {
  'use strict';
  angular.module('app.apps')
    .controller('DatabaseTodoExample', ['AppsService', '$state', 'DatabaseNamesService', 'NotificationService', 'DatabaseService', '$http', 'AuthService', 'TablesService', DatabaseTodoExample]);

  function DatabaseTodoExample(AppsService, $state, DatabaseNamesService, NotificationService, DatabaseService, $http, AuthService, TablesService) {

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

      //var sampleApp = "Todo-MySql";

      DatabaseService.createDB(self.appName, product, '')
      .success(function () {
        // DB is not ready yet
        //createTodoTemplate();
      })
      .error(function (err) {
          self.loading = false;
          NotificationService.add('error', err)
      })
    };

    function createTodoTemplate() {
      try {
        NotificationService.add('info', 'Creating new database with sample template. The process takes 5-7 minutes');
        self.processing = true;
        /* $timeout(function(){self.processing = false;}, 2000);*/
        TablesService.addSchema(self.appName, self.generatorCode)
          .then(function (data) {
            NotificationService.add('success', 'The app is ready with the new tables');
            self.processing = false;
            self.isReady = true;
            //broadcast to NAV
            $rootScope.$broadcast('fetchTables');
            self.isEmptyDb = false;
            checkForExistingTables();
            __insp.push(['tagSession', "addSchema_" + 0]);
            $state.go('getting-started-open', {isnew: 'new'});
          }, function (err) {
            self.processing = false;
            NotificationService.add('error', 'Can not create Todo-List table');
          })
      }
      catch (err) {
        self.processing = false;
        NotificationService.add('error', err.message);
      }
    }

    function checkForExistingTables() {
      AppsService.appDbStat(self.appName)
        .then(function(data){
          self.isEmptyDb = data.data.tableCount == 0;
        })
    }

  }
}());

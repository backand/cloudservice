
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$scope', '$state', 'AppsService', '$interval', '$log', 'NotificationService', 'TablesService', 'DbQueriesService', 'AppState', NavCtrl]);

  function NavCtrl($scope, $state, AppsService, $interval, $log, NotificationService, TablesService, DbQueriesService, AppState){
    var self = this;
    var stop;

    (function init() {
      self.app = null;
      self.tables = [];
      self.queries = [];
    }());


    function loadTables(){
      self.appName = AppState.get();//  $state.params.name
      if (self.appName == undefined)
        return;
      TablesService.get(self.appName).then(
        function (data) {
          self.tables = data;
          if (self.appName) {
            if (self.tables.length == 0) { //only check the database if there are no tables
              AppsService.appDbStat(self.appName).then(successDbStats);
            }
            else{
              self.dbEmpty = false;
            }

            loadDbQueries();
          }
        },
        function (data) {
          $log.debug("TablesService failure", data);
        }
      );
    }

    self.goTo = function(state) {
      if (this.app.DatabaseStatus === 1) {
        $state.go(state, {name: this.appName});
      }
    };

    self.goToAlways = function(state) {
      $state.go(state, {name: this.appName});
    };

    function loadApp() {
      if (typeof self.appName === 'undefined') {
        AppState.reset();
        return;
      }
      AppState.set(self.appName);

      AppsService.getCurrentApp(self.appName).then(successGetCurrentApp, errorGetCurrentApp);
    }

    function successGetCurrentApp(data){
      self.app = data;
      self.DatabaseStatus = self.app.DatabaseStatus;
      var oldStatus = self.app.myStatus.oldStatus ? self.app.myStatus.oldStatus : 0;
      //checkChanges(oldStatus);
      if (self.DatabaseStatus == 0)
        self.tables = [];
      else if(self.DatabaseStatus == 1 && self.tables.length == 0) //only load tables when it's empty
        loadTables();
    }

    function errorGetCurrentApp()
    {
      stopRefresh();
    }


    $scope.$on('$stateChangeSuccess', function() {
      self.state = $state.current.name;
      self.appName = $state.params.name;

      stopRefresh();

      loadApp();

    });

    $scope.$on('AppIsReady', loadApp);

    self.isTablesActive = function() {
      return $state.current.name.indexOf('tables.columns') != -1;
    };

    self.getDBStatus = function() {
      if (self.app === null) {
        return 'unknown';
      }

      switch(parseInt(self.app.myStatus.status)) {
        case 0:
        case 2:
          return 'warning';
        case 1:
          return 'success';
        default:
          return 'error';
      }
    };

    self.goToLocation = function(href) {
        if (self.app.DatabaseStatus === 1) {
            window.open(href, '_blank');
        }
    };

    self.isGeneralState = function () {
      return !$state.params.name;
    };

    function checkChanges(oldStatus) {
      if (oldStatus === undefined) return;

      var newStatus = parseInt(self.app.myStatus.status);
      oldStatus = parseInt(oldStatus);

      if (newStatus === oldStatus) {
        return;
      }

      switch (newStatus) {
        case 0 :
          NotificationService.add('error', 'Database became disconnected');
          break;
        case 1 :
          NotificationService.add('success', 'Database connected');
          break;
        case 2 :
          NotificationService.add('info', 'Database connection became pending');
          break;
      }
    }

    function stopRefresh() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    $scope.$on('$destroy', function() {
      stopRefresh();
    });

    function successDbStats(data){
      if (data.data) {
        self.dbEmpty = data.data.tableCount == 0;
      }
    }

    self.clearTables = function () {
      self.tables = [];
      self.queries = [];
    };

    self.fetchTables = function () {
      self.clearTables();
      loadTables();
    };

    $scope.$on('clearTables', self.clearTables);
    $scope.$on('fetchTables', self.fetchTables);
    $scope.$on('appname:saved', self.fetchTables);

    self.showTable = function(table) {
      var path = 'tables.columns.fields';
      if (self.isTablesActive()) {
        path = $state.current.name;
      }
      $state.go(path, {
        name: $state.params.name,
        tableName: table.name,
        tableId: table.__metadata.id
      });
    };

    self.fetchDbQueries = function () {
      loadDbQueries();
    };

    function loadDbQueries() {
      DbQueriesService.getQueries($state.params.name).then(
        function (data) {
          self.queries = data;
        },
        function (data) {
          $log.debug("DbQueriesService failure", data);
        }
      );
    }

    self.showDbQuery = function(query) {
      var params = {
        name: $state.params.name,
        queryId: query.__metadata.id
      };
      $state.go('dbQueries.query', params);
    };

    self.newDbQuery = function() {
      var params = {
        name: $state.params.name
      };
      $state.go('dbQueries.newQuery', params);
    };

    self.showExample = function(example) {
      if($state.params.name)
        return ($state.params.name.substring(0, 4).toLowerCase() == example);
      else
        return false;
    }
  }
}());

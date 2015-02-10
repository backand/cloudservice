
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$scope', '$state', 'AppsService','$interval', '$log', 'NotificationService', 'TablesService', 'DbQueriesService', NavCtrl]);

  function NavCtrl($scope, $state, AppsService, $interval, $log, NotificationService, TablesService, DbQueriesService){
    var self = this;
    var stop;

    (function init() {
      self.appName = $state.params.name;
      self.app = null;
      self.dbEmpty = false;
      loadTables();
    }());

    function loadTables(){
      TablesService.get($state.params.name).then(
        function (data) {
          self.tables = data;
          if($state.params.name){
            AppsService.appDbStat($state.params.name).then(successDbStats);
            //DbQueriesService.get($state.params.name);
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

    function loadApp() {
      if (typeof self.appName === 'undefined') {
        return
      }
      AppsService.getCurrentApp(self.appName)
        .then(function (data) {
          self.app = data;
          self.DatabaseStatus = self.app.DatabaseStatus;
          var oldStatus = self.app.myStatus.oldStatus ? self.app.myStatus.oldStatus : 0;
          checkChanges(oldStatus);
          if(oldStatus == 0)
            self.tables = [];
        });
    }

    $scope.$on('$stateChangeSuccess', function(){
      self.state = $state.current.name;
      self.appName = $state.params.name;

      stopRefresh();

      loadApp();

      if (typeof self.appName !== 'undefined') {
        stop = $interval(loadApp, 10 * 1000);
      }
    });

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

    function checkChanges(oldStatus) {
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
      if(data.data){
        self.dbEmpty = data.data.tableCount == 0;
      }
    }

    self.tables = [];
    self.queries = [];

    self.fetchTables = function () {
      loadTables();
    };

    $scope.$on('fetchTables', self.fetchTables);
    $scope.$on('appname:saved', self.fetchTables);

    self.showTable = function(table) {
      $state.go('tables.columns', {
        name: $state.params.name,
        tableName: table.name,
        tableId: table.__metadata.id
      });
    };

    self.fetchDbQueries = function () {
      loadDbQueries();
    };

    function loadDbQueries() {
      DbQueriesService.get($state.params.name).then(
        function (data) {
          self.queries = data;
        },
        function (data) {
          $log.debug("DbQueriesService failure", data);
        }
      );
    }

    self.showDbQuery = function(query) {
      query = query || DbQueriesService.newQuery();
      var params = {
        name: $state.params.name,
        queryName: query.name,
        queryId: query.__metadata.id
      };
      $state.go('dbQueries.query', params);
    };
  }
}());

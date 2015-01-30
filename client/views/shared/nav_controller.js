
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$scope', '$state', 'AppsService','$interval', '$log', 'NotificationService', 'TablesService', NavCtrl]);

  function NavCtrl($scope, $state, AppsService, $interval, $log, NotificationService, TablesService){
    var self = this;
    var stop;

    (function init() {
      self.appName = $state.params.name;
      self.app = null;
      $scope.$on('tables.update', loadApp);
    }());

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
          var oldStatus = self.app.myStatus.oldStatus ? self.app.myStatus.oldStatus : 0;
          checkChanges(oldStatus);
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
        if (this.app.DatabaseStatus === 1) {
            window.open(href, '_blank');
        }
    }

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

    self.tables = [];

    self.fetchTables = function () {
      TablesService.get($state.params.name).then(
        function (data) {
          self.tables = data;
        },
        function (data) {
          $log.debug("TablesService failure", data);
        }
      );
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


  }
}());


(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'AppsService','$interval', '$log', 'NotificationService', 'TablesService', NavCtrl]);

  function NavCtrl($rootScope, $scope, $state, AppsService, $interval, $log, NotificationService, TablesService){
    var self = this;
    var stop;

    this.appName = $state.params.name;
    $log.debug("NavCtrl", this.appName);
    this.app = null;

    this.goTo = function(state) {
      if (this.app.DatabaseStatus === 1) {
        $state.go(state, {name: this.appName});
      }
    };

    function loadApp() {

      if (typeof self.appName === 'undefined') {
        return
      }

      AppsService.getCurrentApp(self.appName)
        .then(function(data) {
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
        stop = $interval(loadApp, 30 * 1000);
      }
    });

    this.getDBStatus = function() {
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
    this.goToLocation = function(href) {
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

    $scope.tables = [];
  
    $scope.fetchTables = function(){
      $log.debug("appName", self.appName);
      AppsService.getCurrentApp(self.appName).then(
        function(data) {
          $log.debug(data);
          self.currentApp = data;
          TablesService.get(self.currentApp.Name).then(
            function(data) {
              $log.debug("TablesService success", data);
              $scope.tables = data.data.data;
            },
            function(data) {
              $log.debug("TablesService failure", data);
            }
          );
          
        }, 
        function(err) {
          NotificationService.add('error', 'Can not get current app info');
        }
      );

    };

    $scope.showTable = function(table) {
      $log.debug(table);
      $state.go('tables.columns', { appName: self.appName, tableName: table.name });
    };

    
  }
}());

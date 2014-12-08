
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'AppsService','$interval','NotificationService', NavCtrl]);

  function NavCtrl($rootScope, $scope, $state, AppsService,$interval,NotificationService){
    var self = this;
    var stop;

    this.appName = $state.params.name;
    this.app = null;

    this.goTo = function(state) {
      if (this.app.DatabaseStatus === 1) {
        $state.go(state, {name: this.appName});
      }
    };

    function loadApp() {
      var oldStatus = null;

      if (typeof self.appName === 'undefined') {
        return
      }

      if (self.app !== null) {
        oldStatus = self.app.myStatus.status;
      }

      AppsService.getCurrentApp(self.appName)
        .then(function(data) {
          self.app = data;

          if (oldStatus !== null) {
            checkChanges(oldStatus);
          }
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

    function checkChanges(oldStatus) {
      var newStatus = parseInt(self.app.myStatus.status);

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
  }
}());

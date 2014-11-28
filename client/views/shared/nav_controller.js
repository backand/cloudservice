
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'AppsService','$interval','NotificationService', NavCtrl]);

  function NavCtrl($rootScope, $scope, $state, AppsService,$interval,NotificationService){
    var self = this;
    var stop;

    this.appName = $state.params.name;
    this.app = null;

    function loadApp() {
      if (typeof self.appName !== 'undefined') {

        AppsService.getCurrentApp(self.appName)
          .then(function(data) {
            self.app = data;
          })
      }
    }

    $scope.$on('$stateChangeSuccess', function(){
      self.state = $state.current.name;
      self.appName = $state.params.name;
      loadApp();
      if (typeof self.appName !== 'undefined') {
        setIntarval()
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


    function setIntarval() {
      stop = $interval(function () {
        var oldValue = self.app.myStatus.status;
        var newValue;

        loadApp();
        newValue = parseInt(self.app.myStatus.status);
        if (newValue !== oldValue) {
          switch (newValue) {
            case 0 :
              NotificationService.add('error', 'data base is not connected');
              break;
            case 1 :
              NotificationService.add('success', 'data base connected');
              break;
            case 2 :
              NotificationService.add('info', 'data base is pending');
              break;
          }
        }
      }, 30000);
    }


    function stopRefresh() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      stopRefresh();
    });


  }
}());

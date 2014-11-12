'use strict';

angular.module('app.apps').controller('AppsDataController',
  [ '$scope', 'AppsService','$stateParams',
    function($scope, AppsService,$stateParams) {
      //this.connectDB = AppsService.connect2DB($stateParams.name);

      this.appName = $stateParams.name;
    }]);

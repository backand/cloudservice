'use strict';

angular.module('app.apps').controller('AppsDataController',
  [ 'AppsService','$stateParams',
    function(AppsService,$stateParams) {
      this.appName = $stateParams.name;
    }]);

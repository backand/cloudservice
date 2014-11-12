'use strict';

angular.module('app.apps').controller('AppsIndexController',
  [ '$scope', 'AppsService','appsList',
  function($scope, AppsService,appsList) {
    $scope.apps = appsList.data.data;
}]);

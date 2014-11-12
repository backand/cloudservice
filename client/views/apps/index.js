'use strict';

angular.module('app.apps').controller('AppsIndexController',
  [ 'AppsService','appsList',
  function(AppsService,appsList) {
    this.apps = appsList.data.data;
}]);

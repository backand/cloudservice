
(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('AppsDataController',['$scope','AppsService','$stateParams',AppsDataController]);

  function AppsDataController($scope,AppsService,$stateParams){
    var self = this;
    this.appName = $stateParams.name;



  }
}());

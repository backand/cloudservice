
(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('AppsDataController',['$scope','AppsService','$stateParams','$state',AppsDataController]);

  function AppsDataController($scope,AppsService,$stateParams,$state){
    var self = this;
    this.appName = $stateParams.name;

    this.currentTab = function (){
      return $state.params.data;
    }
  }
}());

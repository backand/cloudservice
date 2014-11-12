
(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('AppsDataController',['AppsService','$stateParams',AppsDataController]);

  function AppsDataController(AppsService,$stateParams){
    var self = this;
    this.appName = $stateParams.name;


  }
}());

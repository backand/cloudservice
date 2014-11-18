
(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('AppsDataController',['$scope','AppsService','$stateParams','$state','DataBaseNamesService',AppsDataController]);

  function AppsDataController($scope,AppsService,$stateParams,$state,DataBaseNamesService){

    var self = this;
    this.appName = $stateParams.name;

    this.currentTab = function (){
      return $state.params.data;
    };

    this.appConnected = function(){
      return (AppsService.currentApp.DatabaseStatus === 2);
    };

    this.switchTab = function(tabName){
      switch(tabName){
        case 'Details' :
          $state.go('apps.data.info',{data:'mysql'});
          break;
        case 'Existing' :
          $state.go('apps.data.exs-source.form',{data:'mysql'});
          break;
        case 'New' :
          $state.go('apps.data.new-source.form',{data:'mysql'});
          break;
      }
    }

  }
}());

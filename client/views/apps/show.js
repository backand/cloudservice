
(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',['$scope','appItem','AppsService',AppsShowController]);

  function AppsShowController($scope,appItem,AppsService){
    var self = this;
    var appData = appItem.data;
    var connectionStateClass = convertStateNumber(appItem.data.DatabaseStatus);

    function convertStateNumber(stateNumber){
      switch(stateNumber){
        case 0:
              return {class:'bg-danger', text:'not connected yet'};
        case 1:
              return {class:'bg-warning', text:'connections in progress'};
        case 2:
              return {class:"bg-success", text:'connections in progress'};
      }
    }

    AppsService.currentApp = appItem.data;

    this.appUploadState = 'bg-danger';
    this.appConnectedState = "bg-success";
    this.appWarnState ='bg-warning';
    console.log('app item: ');
    console.log(appItem.data);

    this.connectionState = connectionStateClass;


    this.appName = appData.Name;

    this.connectionStatus = "";

    //todo: fix update name with server
    //this.updateAppName = function(){
    //  AppsService.update(self.appName,self.appName)
    //}
  }
}());

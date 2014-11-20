
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
              return {class:'bg-warning', text:'not connected yet'};
        case 2:
              return {class:'bg-warning', text:'connections in progress'};
        case 1:
              return {class:"bg-success", text:'connected'};
        default:
          return { class: 'bg-danger', text: 'error'};
      }
    }

    AppsService.setCurrentApp(appItem.data);

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

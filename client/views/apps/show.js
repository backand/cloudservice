
(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',["appItem",'AppsService',AppsShowController]);

  function AppsShowController(appItem,AppsService){
    var self = this;

    this.appUploadState = 'bg-danger';
    this.appConnectedState = "bg-success";
    this.appWarnState ='bg-warning';

    var appData = appItem.data;
    this.appName = appData.Name;

    //todo: fix update name with server
    //this.updateAppName = function(){
    //  AppsService.update(self.appName,self.appName)
    //}
  }
}());


(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',["appItem",AppsShowController]);

  function AppsShowController(appItem){
    var self = this;

    this.appUploadState = 'bg-danger';
    this.appConnectedState = "bg-success";
    this.appWarnState ='bg-warning';

    var appData = appItem.data;
    this.appName = appData.Name;


  }
}());

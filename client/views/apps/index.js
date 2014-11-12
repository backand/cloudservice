
(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('AppsIndexController',['AppsService','appsList',AppsIndexController]);

  function AppsIndexController(AppsService,appsList){
    var self = this;
    this.apps = appsList.data.data;


  }
}());

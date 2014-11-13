
(function  () {
    'use strict';
  angular.module('app.apps')
    .controller('AppsIndexController',['AppsService','appsList','$state','NotificationService',AppsIndexController]);

  function AppsIndexController(AppsService,appsList,$state,NotificationService){
    var self = this;

    this.addApp = function(){
      AppsService.add(self.appName,self.appTitle)
        .success(function(data, status, headers, config) {
          NotificationService.add('success','app was added successfully');
          $state.go('apps.show',{ name: self.appName });
      })
        .error(function(data, status, headers, config) {
          NotificationService.add('error',data);
        })
    };



    this.apps = appsList.data.data;




  }
}());

(function  () {
    'use strict';

  angular.module('app.apps')
    .controller('AppsIndexController',['AppsService', 'appsList', '$state', 'NotificationService', AppsIndexController]);

  function AppsIndexController(AppsService, appsList, $state, NotificationService) {
    var self = this;

    this.addApp = function() {
      AppsService.add(self.appName, self.appTitle)
        .then(function(data){
          NotificationService.add('success', 'App was added successfully');
          $state.go('apps.show', { name: self.appName });
        },function(err){
          NotificationService.add('error', err);
        })
    };

    this.apps = appsList.list;

    this.getRibboninfo = function(app) {
      return convertStateNumber(app.DatabaseStatus);
    };

    function convertStateNumber(stateNumber) {
      switch(stateNumber) {
        case "0":
          return { class: "ui-ribbon-warning", text: 'pending'};
        case "2":
          return { class: "ui-ribbon-warning", text: 'pending'};
        case "1":
          return { class: 'ui-ribbon-success', text: 'connected'};
        default:
          return { class: 'ui-ribbon-danger', text: 'error'};
      }
    }
  }
}());

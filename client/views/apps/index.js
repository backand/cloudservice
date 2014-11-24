(function  () {
    'use strict';

  angular.module('app.apps')
    .controller('AppsIndexController',['$scope','AppsService', 'appsList', '$state', 'NotificationService','$interval', AppsIndexController]);

  function AppsIndexController($scope,AppsService, appsList, $state, NotificationService,$interval) {
    var self = this;
    var stop;

    this.addApp = function() {
      AppsService.add(self.appName, self.appTitle)
        .then(function(data){
          NotificationService.add('success', 'App was added successfully');
          $state.go('database.edit', { name: self.appName });
        },function(err){
          NotificationService.add('error', err);
        })
    };

    this.namePattern = /^\w+$/;

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

    stop = $interval(function() {
      AppsService.all()
        .then(function(apps){
          self.apps = apps.list;
        });
    }, 30000);

    function stopRefresh() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      stopRefresh();
    });


  }
}());

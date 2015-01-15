(function  () {
    'use strict';

  angular.module('app.apps')
    .controller('AppsIndexController',['$scope','AppsService', 'appsList', '$state', 'NotificationService','$interval','$filter','usSpinnerService', AppsIndexController]);

  function AppsIndexController($scope,AppsService, appsList, $state, NotificationService,$interval,$filter,usSpinnerService) {
    var self = this;
    self.loading = false;
    var stop;

    (function () {
      self.apps = appsList.data.data;
    }());

    this.addApp = function() {
      self.loading = true;
      if(self.appTitle === '')
          self.appTitle = self.appName;
      AppsService.add(self.appName, self.appTitle)
        .then(function(data){
          NotificationService.add('success', 'App was added successfully');
          $state.go('database.edit', { name: self.appName });
        },function(err){
          self.loading = false;
          NotificationService.add('error', err);
        })
    };

    this.appDetails = function (appName) {
      usSpinnerService.spin("loading");
      //check app status
      var myApp = $filter('filter')(self.apps, {Name: appName}, false);
      if (myApp[0].DatabaseStatus == 1)
        $state.go('apps.show', {name: appName});
      else
        $state.go('database.edit', {name: appName});
    };

    this.namePattern = /^\w+$/;

    this.getRibboninfo = function(app) {
      return convertStateNumber(app.DatabaseStatus);
    };

    function convertStateNumber(stateNumber) {
      switch(stateNumber) {
        case "0":
          return { class: "ui-ribbon-warning", text: 'Pending'};
        case "1":
          return { class: 'ui-ribbon-success', text: 'Connected'};
        case "2":
          return { class: "ui-ribbon-info", text: 'Creating...'};
        default:
          return { class: 'ui-ribbon-danger', text: 'Error'};
      }
    }

    stop =   $interval(function() {
      AppsService.all()
        .then(function(apps){
          self.apps = apps.data.data;
        });
    }, 10000);

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

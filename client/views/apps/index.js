(function  () {
    'use strict';

  angular.module('app.apps')
    .controller('AppsIndexController',['$scope','AppsService', 'appsList', '$state', 'NotificationService','$interval','AppState','usSpinnerService', '$localStorage', AppsIndexController]);

  function AppsIndexController($scope, AppsService, appsList, $state, NotificationService, $interval, AppState, usSpinnerService, $localStorage) {
    var self = this;
    self.loading = false;
    var stop;

    (function () {
      self.apps = appsList.data.data;
    }());

    self.addApp = function() {
      self.loading = true;
      if(self.appTitle === '')
          self.appTitle = self.appName;
      AppsService.add(self.appName, self.appTitle)
        .then(function(data){
          NotificationService.add('success', 'App was added successfully');
          AppState.set(self.appName);
          $state.go('database.edit', { name: self.appName });
        },function(err){
          self.loading = false;
          NotificationService.add('error', err);
        })
    };

    /**
     *
     * @param appName
     */
    self.appManage = function (appName, status ) {
      usSpinnerService.spin("loading");
      //check app status
      AppState.set(appName);
      if (status == 1)
        $state.go('apps.show', {name: appName});
      else
        $state.go('database.edit', {name: appName});
    };

    /**
     *
     * @param appName
     */
    self.appSettings = function (appName) {
      AppState.set(appName);
      $state.go('apps.edit', {name: appName});
    };

    self.getStarted = function (appName) {
      AppState.set(appName);
      $state.go('playground.get-started', {name: appName});
    };


    self.namePattern = /^\w+$/;

    self.getRibboninfo = function(app) {
      return convertStateNumber(app.DatabaseStatus);
    };

    function convertStateNumber(stateNumber) {
      switch(stateNumber) {
        case 0:
          return { class: "ui-ribbon-warning", text: 'Pending'};
        case 1:
          return { class: 'ui-ribbon-success', text: 'Connected'};
        case 2:
          return { class: "ui-ribbon-info", text: 'Create'};
        default:
          return { class: 'ui-ribbon-danger', text: 'Error'};
      }
    }

    stop = $interval(function() {
      AppsService.all()
        .then(function(apps){
          self.apps = apps.data.data;
        },function(error){
          stopRefresh();
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

    self.showJumbo = function () {
      return  !$localStorage.backand.hideJumbo;
    };

    self.closeJumbo = function () {
      self.hideJumbo = true;
      $localStorage.backand.hideJumbo = true;
    }

  }
}());

(function  () {
    'use strict';

angular.module('backand.apps')
  .controller('AppsIndexController',['$scope', 'AppsService', 'appsList', '$state', 'NotificationService', '$interval',
    'usSpinnerService', 'LayoutService', '$analytics', 'AuthService', AppsIndexController]);

  function AppsIndexController($scope, AppsService, appsList, $state, NotificationService, $interval,
                                usSpinnerService, LayoutService, $analytics, AuthService) {

    var self = this;
    self.loading = false;
    var stop;

    (function () {
      self.apps = appsList.data;
    }());

    self.addApp = function() {
      self.loading = true;
      if(self.appTitle === '')
          self.appTitle = self.appName;

      AppsService.add(self.appName, self.appTitle)
        .then(function(data) {
          $analytics.eventTrack('createdApp', {});
          NotificationService.add('success', 'App was added successfully');
          $state.go('database.edit', { appName: self.appName });
        },
        function(err) {
          self.loading = false;
          // the error message already shows
          //NotificationService.add('error', err);
        })
    };

    /**
     *
     * @param appName
     */
    self.appManage = function (app) {
      usSpinnerService.spin("loading");
      //check app status

      if (app.DatabaseStatus == 1)
        $state.go('app.show', {appName: app.Name});
      else {
        if (self.exampleApp(app)) {
          $state.go('database.example', {appName: app.Name});
        }
        else {
          $state.go('database.edit', {appName: app.Name});
        }
      }
    };

    /**
     *
     * @param appName
     */
    self.appSettings = function (appName) {
      $state.go('app.edit', {appName: appName});
    };

    self.goToLink = function (appName) {
      $state.go('playground.show', {appName: appName});
    };

    self.todoExample = function (appName) {
      $state.go('playground.todo', {appName: appName});
    };

    self.namePattern = /^\w+$/;

    self.getRibboninfo = function(app) {
      return convertStateNumber(app);
    };

    function convertStateNumber(app) {
      var ribbonInfo;
      switch(app.DatabaseStatus) {
        case 0:
          ribbonInfo = { class: "ui-ribbon-warning", text: 'Pending'};
          break;
        case 1:
          ribbonInfo = { class: 'ui-ribbon-success', text: 'Connected'};
          break;
        case 2:
          ribbonInfo = { class: "ui-ribbon-info", text: 'Create'};
          break;
        default:
          ribbonInfo = { class: 'ui-ribbon-danger', text: 'Error'};
          break;
      }
      if (self.exampleApp(app))
        ribbonInfo.text = 'Example';
      return ribbonInfo;
    }

    self.exampleApp = function(app){
      return AppsService.isExampleApp(app);
    };

    stop = $interval(function() {
      AppsService.all()
        .then(function(apps) {
          self.apps = apps.data;
        },
        function(error) {
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
      return LayoutService.showJumbo();
    };

    self.closeJumbo = function () {
      LayoutService.closeJumbo();
    };

    self.openJumbo = function () {
      LayoutService.openJumbo();
    };

    self.setUserId = function (x) {
      AuthService.setUserId(x);
    }

  }
}());

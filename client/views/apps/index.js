(function  () {
    'use strict';

  angular.module('app.apps')
    .controller('AppsIndexController', ['$scope', 'AppsService', 'appsList', '$state', 'NotificationService', '$interval', 'AppState', 'usSpinnerService', 'LayoutService', 'AuthService', AppsIndexController]);

  function AppsIndexController($scope, AppsService, appsList, $state, NotificationService, $interval, AppState, usSpinnerService, LayoutService, AuthService) {
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
    self.appManage = function (app) {
      usSpinnerService.spin("loading");
      //check app status
      AppState.set(app.Name);

      if (app.DatabaseStatus == 1)
        $state.go('apps.show', {name: app.Name});
      else {
        if (app.Name === 'todo' + AuthService.getUserId())
          $state.go('database.example', {name: app.Name});
        else
          $state.go('database.edit', {name: app.Name});
      }
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
      if (app.Name === 'todo' + AuthService.getUserId())
        ribbonInfo.text = 'Example';
      return ribbonInfo;
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

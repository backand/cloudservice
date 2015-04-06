(function () {
  'use strict';

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', 'usSpinnerService', 'LayoutService', 'SessionService', '$location', HeaderController]);

  function HeaderController($scope, AppsService, $state, usSpinnerService, LayoutService, SessionService, $location) {
    var self = this;

    self.apps = AppsService.apps;
    self.currApp = _.find(self.apps.list, {Name: $state.params.appName});

    self.getAppStatus = function (appName) {
      return AppsService.getAppStatus(appName);
    };

    self.getAppStyle = function (appName) {
      if (self.getAppStatus(appName) == 0)
        return {color: 'red'};
    };

    $scope.$on('$stateChangeSuccess', function () {
      self.currApp = self.currApp || $state.params.appName ?
        _.find(self.apps.list, {Name: $state.params.appName}) : null;
      usSpinnerService.stop('loading-app');
    });

    self.goToApp = function () {
      usSpinnerService.spin('loading-app');
      AppsService.all()
        .then(function () {
          self.currApp = _.find(self.apps.list, {Name: self.currApp.Name});
          var appStatus = self.currApp.DatabaseStatus;
          var params = {appName: self.currApp.Name};
          var state;

          if (appStatus == 2) {
            state = 'docs.get-started';
          }
          else if (appStatus == 0) {
            state = 'database.edit';
          }
          else if (AppsService.isExampleApp(self.currApp)) {
            state = 'playground.todo'
          }
          else {
            state = 'app.show';
          }

          $state.go(state, params)
            .then(function () {
              usSpinnerService.stop('loading-app');
            });
        })
    };

    self.hideAppList = function () {
      return $state.current.name === 'apps.index' && LayoutService.showJumbo();
    };

    self.getCurrentUser = function () {
      return SessionService.currentUser;
    };

    self.logout = function () {
      SessionService.ClearCredentials();
      $location.path("/sign_in")
    };
  }


}());


(function () {
  'use strict';

  function HeaderController($scope, AppsService, $state, $filter, AppState, usSpinnerService, NotificationService, LayoutService) {
    var self = this;

    self.currAppName = '';

    this.redirectTo = function (appName) {
      usSpinnerService.spin('loading-app');
      var app = angular.copy($filter('filter')(self.apps, function (a) {
        return a.Name === appName;
      })[0]);

      if (app.DatabaseStatus == 1) {
        $state.go('apps.show', {name: appName});
      }
      else if (app.DatabaseStatus==2) {
        usSpinnerService.stop('loading-app');
        self.currAppName = '';
        NotificationService.add('error', 'Please wait until the database is connected');
        return;
      }
      else {
        $scope.$root.$broadcast('clearTables');
        $state.go('database.edit', {name: appName});
      }
    };

    this.goTo = function (state) {
      AppState.reset();
      $state.go(state, {name: ''});
    };

    $scope.$on('$stateChangeSuccess', function () {
      AppsService.getApps()
        .then(function (apps) {
          self.apps = apps.list;
          self.currAppName = $state.params.name;
          self.currAppName = AppState.get();
          usSpinnerService.stop('loading-app');
        });
    });

    self.hideAppList = function () {
      return $state.current.name === 'apps.index' && LayoutService.showJumbo();
    }
  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', '$filter', 'AppState', 'usSpinnerService', 'NotificationService', 'LayoutService', HeaderController]);

}());


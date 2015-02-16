(function () {
  'use strict';

  function HeaderController($scope, AppsService, $state, $filter, AppState) {
    var self = this;

    self.currAppName = '';

    this.redirectTo = function (appName) {
      var app = angular.copy($filter('filter')(self.apps, function (a) {
        return a.Name === appName;
      })[0])
      AppState.set(appName);
      if (app.DatabaseStatus == 1) {
        $state.go('apps.show', {name: appName});
      }
      else{
        $scope.$root.$broadcast('clearTables');
        $state.go('database.edit', {name: appName});
      }
    };

    this.goTo = function (state) {
      AppState.reset();
      $state.go(state, {name: ''});
    };

    $scope.$on('$stateChangeSuccess', function () {
      AppsService.all()
        .then(function (data) {
          self.apps = data.data.data;
          self.currAppName = AppState.get();
        });
    });
  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', '$filter','AppState', HeaderController]);

}());


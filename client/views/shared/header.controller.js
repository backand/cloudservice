(function () {
  'use strict';

  function HeaderController($scope, AppsService, $state, $filter) {
    var self = this;

    self.currAppName = '';

    this.redirectTo = function (appName) {
      var app = angular.copy($filter('filter')(self.apps, function (a) {
        return a.Name === appName;
      })[0])



      if (app.DatabaseStatus == 1) {
        $state.go('apps.show', {name: appName});
      }
      else{
        $scope.$root.$broadcast('clearTables');
        $state.go('database.edit', {name: appName});
      }
    };

    this.goTo = function (state) {
      $state.go(state, {name: ''});
    };

    $scope.$on('$stateChangeSuccess', function () {
      AppsService.all()
        .then(function (data) {
          self.apps = data.data.data;
          self.currAppName = $state.params.name;
        });
    });
  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope", 'AppsService', '$state', '$filter', HeaderController]);

}());


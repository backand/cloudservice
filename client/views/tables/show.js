(function  () {
  'use strict';
  angular.module('app')
    .controller('TablesShow', ['$scope', '$state', 'AppsService', 'usSpinnerService', 'NotificationService', 'TablesService', TablesShow]);

  function TablesShow($scope, $state, AppsService, usSpinnerService, NotificationService, TablesService) {
    var self = this;
    var currentApp;

    AppsService.getCurrentApp($state.params.name)
      .then(function(data) {
        currentApp = data;

        TablesService.get()
          .then(function (data) {
            self.tables = data.data;
            console.log("Tables");
            console.log(self.tables);
          });

      }, function(err) {
        NotificationService('error', 'Can not get current app info');
      });

    this.back = function() {
      $state.go('apps.show', ({ name:$state.params.name }));
    };
  }
}());

(function  () {
  'use strict';
  angular.module('app')
    .controller('TablesShow', ['$scope', '$state', 'AppsService', 'usSpinnerService', 'NotificationService', 'DatabaseService', TablesShow]);

  function TablesShow($scope, $state, AppsService, usSpinnerService, NotificationService, DatabaseService, DatabaseNamesService) {
    var self = this;
    var currentApp;

    AppsService.getCurrentApp($state.params.name)
      .then(function(data) {
        currentApp = data;
      }, function(err) {
        NotificationService('error', 'Can not get current app info');
      });

    this.back = function() {
      $state.go('apps.show', ({ name:$state.params.name }));
    };
  }
}());

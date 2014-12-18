(function  () {
  'use strict';
  angular.module('app')
    .controller('TablesShow', ['$scope', '$state', 'AppsService', 'usSpinnerService', 'NotificationService', 'TablesService', TablesShow]);

  function TablesShow($scope, $state, AppsService, usSpinnerService, NotificationService, TablesService) {
    var self = this;
    var currentApp;

    AppsService.getCurrentApp($state.params.name)
      .then(function(data) {
        self.currentApp = data;
        self.reloadTables();
      }, function(err) {
        NotificationService('error', 'Can not get current app info');
      });

    this.reloadTables = function() {
      usSpinnerService.spin("loading");

      TablesService.get(self.currentApp)
        .then(function (data) {
          usSpinnerService.stop("loading");
          self.tables = data.data.data;
        }, function(err) {
          usSpinnerService.stop("loading");
          NotificationService('error', 'Can not get tables list');
      });
    }

    this.sync = function() {
      self.syncing = true;

      TablesService.sync(self.currentApp)
        .then(function (data) {
          self.syncing = false;
          NotificationService.add('info', 'Synchronized tables');
        }, function(err) {
          self.syncing = false;
          NotificationService.add('error', 'Can not sync tables');
        });
    }
  }
}());

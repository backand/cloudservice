
(function  () {

  'use strict';
  angular.module('backand.apps')
    .controller('AppShowController',['$scope', 'AppsService', '$sce', '$state', AppShowController]);

  function AppShowController($scope, AppsService, $sce, $state){
    var self = this;

    var app = AppsService.currentApp;
    self.appName = app.Name;
    $scope.appName = self.appName;

    $scope.$root.$broadcast('fetchTables');

    //not connected to database :
    if (app.DatabaseStatus !== 1) {
      return $state.go('database.edit', {name: self.appName})
    }

    self.statisticsArray = app.stat;

    self.logLimit = 7;
    self.appTitle = app.Title;
    self.connectionStatus = '';
    self.alertMsg = '';

    self.goToLocation = function(href) {
        window.open(href, '_blank');
    };

    AppsService.appDbStat($state.params.appName)
      .then(function(data){
        if (data.data.tableCount == 0) {
          var msg = 'Your database has no tables! go to <a href="#/' + $state.params.appName + '/database/template/' +
            '">Database Templates</a> to populate the database or use any DB admin tool like Workbench or phpMyAdmin';

          self.alertMsg = $sce.trustAsHtml(msg);
          AppsService.setAlert($state.params.appName, msg)
        }
      });


    self.setAlertStatus = function() {
      AppsService.setAlert(self.appName, '');
      self.alertMsg = '';
    };

    $scope.$on('$destroy', function() {

    });


    self.updateAppName = function() {
      AppsService.update(self.appName, self.appTitle)
    }
  }
}());

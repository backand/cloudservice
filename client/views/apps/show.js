
(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',['$scope','appItem','AppsService','$sce','$state','AppState',AppsShowController]);

  function AppsShowController($scope,appItem,AppsService,$sce,$state,AppState){
    var self = this;

    var appData = appItem.data;
    self.appName = appData.Name;
    $scope.appName = self.appName;

    AppState.set(self.appName);

    AppsService.setCurrentApp(appItem.data);
    $scope.$root.$broadcast('fetchTables');

    //not connected to database :
    if (appItem.data.DatabaseStatus !== 1) {
      return $state.go('database.edit',{name: self.appName})
    }

    self.statisticsArray = appItem.data.stat;

    var time = new Date();
    self.logLimit = 7;
    self.appTitle = appData.Title;
    self.connectionStatus = '';
    self.alertMsg = '';

    self.goToLocation = function(href) {
        window.open(href,'_blank');
    }

    AppsService.appDbStat($state.params.name)
      .then(function(data){
        if (data.data.tableCount == 0) {
          var msg = 'Your database has no tables! go to <a href="#/database/template/' + $state.params.name + '">Database Templates</a> to populate the database or use any DB admin tool like Workbench or phpMyAdmin';
          self.alertMsg = $sce.trustAsHtml(msg);
          AppsService.setAlert($state.params.name, msg)
        }
      })


    self.setAlertStatus = function(){
        AppsService.setAlert(self.appName,'');
    }

    $scope.$on('$destroy', function() {

    });


    self.updateAppName = function(){
      AppsService.update(self.appName, self.appTitle)
    }
  }
}());

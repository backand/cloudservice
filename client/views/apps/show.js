
(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',['$scope','appItem','AppsService','$sce','$state','AppLogService',AppsShowController]);

  function AppsShowController($scope,appItem,AppsService,$sce,$state,AppLogService){
    var self = this;
    var appData = appItem.data;
    $scope.appName = appData.Name;

    AppsService.setCurrentApp(appItem.data);
    $scope.$root.$broadcast('fetchTables');

    //not connected to database :
    if (appItem.data.DatabaseStatus !== 1) {
      return $state.go('database.edit',{name: $state.params.name})
    }

    this.statisticsArray = appItem.data.stat;

    var time = new Date();
    this.logLimit = 7;
    this.appTitle = appData.Title;
    this.appName = appData.Name;
    this.connectionStatus = '';
    this.alertMsg = '';

    this.goToLocation = function(href) {
        window.open(href,'_blank');
    }

    function goToTemplate(){
      alert(1);
    }
    AppsService.appDbStat($state.params.name)
      .then(function(data){
        if (data.data.tableCount == 0) {
          var msg = 'Your database has no tables! go to <a href="#/database/template/' + $state.params.name + '">Database Templates</a> to populate the database or use any DB admin tool like Workbench or phpMyAdmin';
          self.alertMsg = $sce.trustAsHtml(msg);
          AppsService.setAlert($state.params.name,msg)
        }
      })


    this.setAlertStatus = function(){
        AppsService.setAlert($state.params.name,'');
    }

    $scope.$on('$destroy', function() {

    });


    this.updateAppName = function(){
      AppsService.update(self.appName, self.appTitle)
    }
  }
}());

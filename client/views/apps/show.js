
(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppsShowController',['$scope','appItem','AppsService','$interval','$state','AppLogService',AppsShowController]);

  function AppsShowController($scope,appItem,AppsService,$interval,$state,AppLogService){
    var self = this;
    var appData = appItem.data;

    AppsService.setCurrentApp(appItem.data);

    //not connected to database :
    if (appItem.data.DatabaseStatus !== 1) {
      $state.go('database.edit',{name: $state.params.name})
    }

    console.log('app item: ');
    console.log(appItem.data);

    this.statisticsArray = appItem.data.durados_App_Stat;
    AppLogService.getAppLog($state.params.name)
      .success(function(data){
        self.appLogArray = AppLogService.createLogMsg(data.data);
      });

    var time = new Date();


    this.logLimit = 7;

    this.appTitle = appData.Title;

    this.appName = appData.Name;

    this.connectionStatus = "";



  $scope.$on('$destroy', function() {

  });


    this.updateAppName = function(){
      AppsService.update(self.appName, self.appTitle)
    }
  }
}());


(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppSettings',['$scope','appItem','AppsService','$state','NotificationService',AppSettings]);

  function AppSettings($scope,appItem,AppsService,$state,NotificationService){
    var self = this;
    this.loading = false;

    var appData = appItem.data;
    $scope.appName = appData.Name;

    AppsService.setCurrentApp(appItem.data);

    this.appTitle = appData.Title;
    this.appName = appData.Name;
    this.dateFormat = 'MM/dd/yyyy';
    this.datesFormar = ['MM/dd/yyyy','dd/MM/yyyy'];
    this.defaultPageSize = 20;


    this.sumbitForm = function(){
      self.loading = true;
      AppsService.update(self.appName, self.appTitle)
        .success(function (data) {
          NotificationService.add('success', 'Application settings updated successfully');
          self.loading = false;
        })
        .error(function (err) {
          self.loading = false;
        })

    }
  }
}());


(function  () {

  'use strict';
  angular.module('app.apps')
    .controller('AppSettings',['$scope','$window','appItem','AppsService','$state','NotificationService',AppSettings]);

  function AppSettings($scope,$window,appItem,AppsService,$state,NotificationService){
    var self = this;
    this.loading = false;

    var appData = appItem.data;
    $scope.appName = appData.Name;

    AppsService.setCurrentApp(appItem.data);

    this.globalAppName = appData.Name;
    this.appName = appData.Name;
    this.appTitle = appData.Title;
    this.dateFormat = appData.settings.defaultDateFormat;
    this.datesFormar = ['MM/dd/yyyy','dd/MM/yyyy'];
    this.defaultPageSize = appData.settings.defaultPageSize;


    this.sumbitForm = function(){
      self.loading = true;
      var data= {
        Name:self.appName,
        Title:self.appTitle,
        settings : {
          defaultDateFormat: self.dateFormat,
          defaultPageSize: self.defaultPageSize
        }
      };
      AppsService.update(self.globalAppName,data).then(submitSuccess, errorHandler);
    }

    function submitSuccess(error, message) {
      NotificationService.add('success', 'Application settings updated successfully');
      self.loading = false;

      if(self.globalAppName !=self.appName)
        $state.go('apps.index', {name: ''});
    }

    this.delete = function(){
      var result = $window.confirm('Are you sure you want to delete the app?');
      if(!result)
        return;
      AppsService.delete(self.globalAppName).then(deleteSuccess, errorHandler);
      $state.go('apps.index', {name: ''});
    };

    function deleteSuccess() {
      NotificationService.add('success', 'The application was deleted');
      self.loading = false;
    }
    /**
     * delegate errors to the notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.loading = false;
    }
  }
}());

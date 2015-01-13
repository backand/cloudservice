/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function ViewSettingsController($scope, ColumnsService, NotificationService ) {

    var self = this;

    (function init() {
      getSettings();
      $scope.$on('tabs:settings', getSettings);
    }());

    function getSettings() {
      ColumnsService.get($stateParams.name, self.tableId)
        .then(successHandler, errorHandler);
    }

    /**
     * extract and bind the data to the scope
     * @param data
     */
    function successHandler(data) {
      self.view = data.data;
      self.fields = data.data.fields;
    }

    /**
     * delegate any error to notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

  angular.module('app')
    .controller('ViewSettingsController',['$scope','ColumnsService','NotificationService', ViewSettingsController]);
}());

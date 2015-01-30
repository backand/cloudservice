/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {
  /**
   * get the fields items from the server in response
   * to 'tabs:fields' event.
   *
   * @param $scope
   * @param ColumnsService
   * @param NotificationService
   * @constructor
   */
  function FieldsController($scope, ColumnsService, NotificationService) {

    var self = this;

    /**
     * init an empty items array, send an ajax
     * call to populate the items array and
     * register an event listener on scope
     */
    (function init() {
      self.items = [];
      getFields();
      $scope.$on('tabs:fields', getFields);
      $scope.$on('appname:saved', reloadFields);
    }());

    /**
     * Force to load the view
     */
    function reloadFields() {
        ColumnsService.get().then(successHandler, errorHandler)
    }

    /**
     * ajax call to get the fields items
     */
    function getFields() {
      if(self.view == null && ColumnsService.tableName != null)
        ColumnsService.get().then(successHandler, errorHandler)
    }

    /**
     * extract and bind the data to the scope
     * @param data
     */
    function successHandler(data) {
      self.items = data.fields;
      self.view = data;
    }

    /**
     * watch for changes in view object
     */
    $scope.$watch('fields.view', function (newVal,oldValue){
      if(newVal != null && oldValue != null && newVal !== oldValue) {
        ColumnsService.commit(self.view);
        if(self.view.name != self.view.__metadata.name)
          $scope.$emit('appname:updated',self.view.name);
      }
    }, true);

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
    .controller('FieldsController', ['$scope', 'ColumnsService', 'NotificationService', FieldsController]);
}());

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
    }());

    /**
     * ajax call to get the fields items
     */
    function getFields() {
      if(self.view == null)
        ColumnsService.get().then(successHandler, errorHandler)
    }

    /**
     * extract and bind the data to the scope
     * @param data
     */
    function successHandler(data) {
      self.items = data.data.fields;
      self.view = data.data;
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
    .controller('FieldsController', ['$scope', 'ColumnsService', 'NotificationService', FieldsController]);
}());

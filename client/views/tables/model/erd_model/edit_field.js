(function () {

  angular.module('backand')
    .controller('EditFieldController', [
      '$modalInstance',
      'tableData',
      'fieldName',
      'DataService',
      '$filter',
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                             tableData,
                             fieldName,
                             $filter) {
    var self = this;

    self.tableData = tableData;
    self.fieldName = fieldName;
    self.editFieldForm = 'edit-field';

    self.saveField = function () {

    };

    self.cancelEditField = function(){

    };

  }
}());

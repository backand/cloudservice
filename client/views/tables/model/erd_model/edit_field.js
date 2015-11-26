(function () {

  angular.module('backand')
    .controller('EditFieldController', [
      '$modalInstance',
      'tableName',
      'fieldName',
      'DbDataModel',
      'AppsService',
      '$filter',
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                               tableName,
                               fieldName,
                               DbDataModel,
                               AppsService,
                               $filter) {
    var self = this;

    self.tableName = tableName;
    self.fieldName = fieldName;
    self.editFieldForm = 'edit-field';

    self.saveField = function () {
      var fieldObj = {};
      fieldObj[self.fieldName] = {type: self.fieldType};
      DbDataModel.addField(AppsService.currentApp, self.tableName, fieldObj);
    };

    self.cancelEditField = function () {
      modalInstance.dismiss('cancel');
    };

  }
}());

(function () {
  'use strict';
  angular.module('backand')
    .controller('EditFieldController', [
      '$modalInstance',
      'tableName',
      'fieldName',
      'appName',
      'newModel',
      'DbDataModel',
      'AppsService',
      '$filter',
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                               tableName,
                               fieldName,
                               appName,
                               newModel,
                               DbDataModel,
                               AppsService,
                               $filter) {
    var self = this;

    self.appName = appName;
    self.tableName = tableName;
    self.fieldName = fieldName;
    self.newModel = newModel;
    self.editFieldForm = 'edit-field';



    self.addField = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      var fieldToAdd = {};
      fieldToAdd[self.fieldName] = {type: self.fieldType};
      var object = _.find(newModelObject, {name: self.tableName});
      _.extend(object.fields, fieldToAdd);
      //DbDataModel.saveCustomSchema(self.appName, JSON.stringify(newModelObject));
      //modalInstance.dismiss('added');
      modalInstance.close({model: newModelObject});
    };

    self.cancelEditField = function () {
      modalInstance.dismiss('cancel');
    };

  }
}());

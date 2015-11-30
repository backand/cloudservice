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
      'TablesService',
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
                               TablesService,
                               $filter) {
    var self = this;

    self.appName = appName;
    self.tableName = tableName;
    self.fieldName = fieldName;
    self.newModel = newModel;
    self.editFieldForm = 'edit-field';
    self.typeOptions = [
      'string',
      'text',
      'datetime',
      'float',
      'boolean',
      'collection'
    ];
    self.objectOptions = TablesService.tables;


    self.addField = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      if (self.fieldType == 'collection') {
        createCollectionField(newModelObject, self.fieldName, self.relatedObject.name, self.viaField);
      }
      else {
        createSimpleField(newModelObject, self.fieldName, self.fieldType, self.tableName);
      }
      //DbDataModel.saveCustomSchema(self.appName, JSON.stringify(newModelObject));
      //modalInstance.dismiss('added');
      modalInstance.close({model: newModelObject});
    };

    self.cancelEditField = function () {
      modalInstance.dismiss('cancel');
    };


    function createCollectionField(model, fieldName, relatedObject, viaField) {
      // Create field on the selected object
      var fieldToAdd = {};
      fieldToAdd[fieldName] = {collection: relatedObject, via: viaField};
      addGenericField(model, self.tableName, fieldToAdd);

      // Create field on the related object
      fieldToAdd = {};
      fieldToAdd[viaField] = {object: self.tableName};
      addGenericField(model, relatedObject, fieldToAdd);
    }

    // Create field of a simple type, e.g {type: string}
    function createSimpleField(model, fieldName, fieldType, tableName) {
      var fieldToAdd = {};
      fieldToAdd[fieldName] = {type: fieldType};
      addGenericField(model, tableName, fieldToAdd);
    }

    // Add a field from an existing field object given to the function
    function addGenericField(model, tableName, fieldToAdd) {
      var object = _.find(model, {name: tableName});
      _.extend(object.fields, fieldToAdd);
    }

  }
}());

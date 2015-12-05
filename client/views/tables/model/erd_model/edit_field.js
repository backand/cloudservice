(function () {
  'use strict';
  angular.module('backand')
    .controller('EditFieldController', [
      '$modalInstance',
      'tableName',
      'fieldName',
      'appName',
      'newModel',
      'TablesService',
      'FieldsService',
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                               tableName,
                               fieldName,
                               appName,
                               newModel,
                               TablesService,
                               FieldsService) {
    var self = this;

    self.appName = appName;
    self.tableName = tableName;
    self.fieldName = fieldName;
    self.newModel = newModel;
    self.editFieldForm = 'edit-field';
    self.showUniqueSection = false;

    // If editing a field, get the field from the model by the field name
    // If editing a field, set field type
    if (self.fieldName) {
      var newModelObject = JSON.parse(self.newModel.schema);
      self.field = getField(newModelObject, self.tableName, self.fieldName);

      if (self.field.type) {
        self.fieldType = self.field.type;
      }
      else if (self.field.collection) {
        self.fieldType = 'collection';
        self.relatedObject = self.field.collection;
        self.viaField = self.field.via;
      }
      else {
        self.fieldType = 'object';
      }
    }

    // Indicate whether to display edit or add form
    self.isEdit = self.fieldName;

    self.typeOptions = [
      'string',
      'text',
      'datetime',
      'float',
      'boolean',
      'collection'
    ];
    // If editing a field, be able to show the 'object' type
    if (self.isEdit) {
      self.typeOptions.push('object');
    }

    self.objectOptions = getObjectNames();


    self.editField = function () {
      FieldsService.editField(self.tableName, self.field);

      modalInstance.close({model: newModelObject});
    };

    self.deleteField = function () {
      FieldsService.deleteField(self.tableName, self.fieldName);
      modalInstance.close({model: FieldsService.newModelObject});
    };

    self.addField = function () {
      FieldsService.addField(self.tableName, self.fieldName, self.fieldType, self.relatedObject, self.viaField);
      modalInstance.close({model: FieldsService.newModelObject});
    };

    self.cancelEditField = function () {
      modalInstance.dismiss('cancel');
    };


    function getObjectNames() {
      var newModelObject = JSON.parse(self.newModel.schema);
      return _.pluck(newModelObject, 'name');
    }

    function getField(model, tableName, fieldName) {
      var object = _.find(model, {name: tableName});
      return object.fields[self.fieldName];
    }

  }
}());

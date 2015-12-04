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
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                               tableName,
                               fieldName,
                               appName,
                               newModel,
                               TablesService) {
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
      var newModelObject = JSON.parse(self.newModel.schema);
      var field = getField(newModelObject, self.tableName, self.field.name);
      _.extend(field, self.field);

      modalInstance.close({model: newModelObject});
    };

    self.deleteField = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      var object = _.find(newModelObject, {name: tableName});
      delete object.fields[self.fieldName];

      modalInstance.close({model: newModelObject});
    };

    self.addField = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      if (self.fieldType == 'collection') {
        createCollectionField(newModelObject, self.fieldName, self.relatedObject.name, self.viaField);
      }
      else {
        createSimpleField(newModelObject, self.fieldName, self.fieldType, self.tableName);
      }
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

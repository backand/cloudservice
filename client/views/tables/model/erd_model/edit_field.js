(function () {
  'use strict';
  angular.module('backand')
    .controller('EditFieldController', [
      '$modalInstance',
      'tableName',
      'fieldName',
      'appName',
      'newModel',
      'updateErd',
      'FieldsService',
      'NotificationService',
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                               tableName,
                               fieldName,
                               appName,
                               newModel,
                               updateErd,
                               FieldsService,
                               NotificationService) {
    var self = this;

    self.appName = appName;
    self.tableName = tableName;
    self.fieldName = fieldName;
    self.newModel = newModel;
    self.updateErd = updateErd;
    self.editFieldForm = 'edit-field';
    self.showUniqueSection = false;

    // Indicate whether to display edit or add form
    self.isEdit = self.fieldName;

    // If editing a field, Populate the inputs by the field data
    if (self.isEdit) {
      self.field = FieldsService.getField(self.tableName, self.fieldName);

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
      self.isCollectionOrObject = self.fieldType == 'collection' || self.fieldType == 'object';
    }

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
      FieldsService.editField(self.tableName, self.fieldName, self.field);
      modalInstance.close({model: FieldsService.newModelObject});
    };

    self.deleteField = function () {
      var fieldToDelete = FieldsService.getField(self.tableName, self.fieldName);
      if (fieldToDelete.collection) {
        FieldsService.deleteField(fieldToDelete.collection, fieldToDelete.via);
      }
      else if (fieldToDelete.object) {
        FieldsService.removeFieldsRelatingToField(fieldToDelete.object, self.tableName, self.fieldName)
      }
      FieldsService.deleteField(self.tableName, self.fieldName);
      modalInstance.close({model: FieldsService.newModelObject});
    };

    self.addField = function () {
      FieldsService.addField(self.tableName, self.fieldName, self.fieldType, self.relatedObject, self.viaField);
      self.updateErd().then(function (data) {
        self.editFieldForm.$setPristine();
        resetAddFieldValues();
        NotificationService.add('success', 'Field added successfully');
      });
    };

    self.cancelEditField = function () {
      modalInstance.dismiss('cancel');
    };

    function getObjectNames() {
      var newModelObject = JSON.parse(self.newModel.schema);
      return _.pluck(newModelObject, 'name');
    }

    function resetAddFieldValues() {
      self.fieldName = '';
      self.fieldType = '';
      self.relatedObject = '';
      self.viaField = '';
    }
  }
}());

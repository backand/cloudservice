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
      'usSpinnerService',
      EditFieldController
    ]);

  function EditFieldController(modalInstance,
                               tableName,
                               fieldName,
                               appName,
                               newModel,
                               updateErd,
                               FieldsService,
                               NotificationService,
                               usSpinnerService) {
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
      self.fieldType = FieldsService.getFieldType(self.tableName, self.fieldName);

      if (self.fieldType == 'collection') {
        self.relatedObject = self.field.collection;
        self.viaField = self.field.via;
      }
      self.isCollectionOrObject = self.fieldType == 'collection' || self.fieldType == 'object';
    }

    self.typeOptions = [
      'string',
      'text',
      'datetime',
      'float',
      'boolean',
      'collection',
      'object'
    ];

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
      if (isFieldNameExists(self.fieldName)) {
        NotificationService.add('warning', 'Field already exists');
      } else if (self.relatedObject && FieldsService.getField(self.relatedObject, self.viaField)) {
        NotificationService.add('warning', 'Related field already exists');
      } else {
        FieldsService.addField(self.tableName, self.fieldName, self.fieldType, self.relatedObject, self.viaField);
        self.updateErd().then(function (data) {
          self.editFieldForm.$setPristine();
          resetAddFieldValues();
          NotificationService.add('success', 'Field added successfully');
        });
      }
    };

    self.cancelEditField = function () {
      modalInstance.dismiss('cancel');
    };

    function getObjectNames() {
      var newModelObject = JSON.parse(self.newModel.schema);
      var allObjects = _.pluck(newModelObject, 'name');
      return _.reject(allObjects, function (object) {
        return object === self.tableName;
      });
    }

    function resetAddFieldValues() {
      self.fieldName = '';
      self.fieldType = '';
      self.relatedObject = '';
      self.viaField = '';
    }

    function isFieldNameExists(name) {
      var fields = FieldsService.getObjectFields(self.tableName);
      return _.some(_.keys(fields), function (field) {
        return field.toLowerCase() === name.toLowerCase();
      });
    }
  }
})();

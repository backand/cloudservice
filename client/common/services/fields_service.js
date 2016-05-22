(function () {
  'use strict';

  angular.module('common.services')
    .service('FieldsService', ['DbDataModel', 'AppsService', FieldsService]);

  function FieldsService(DbDataModel, AppsService) {
    var self = this;

    init();

    self.getField = function (objectName, fieldName) {
      var objectFields = self.getObjectFields(objectName);
      if (objectFields[fieldName]) {
        return objectFields[fieldName];
      } else {
        return _.where(objectFields, {rename: fieldName})[0];
      }
    };

    // Need another method for finding a renamed object (because the name is under "rename" property in the json)
    self.getRenamedField = function (objectName, newFieldName) {
      var objectFields = self.getObjectFields(objectName);
      return _.where(objectFields, {rename: newFieldName})[0];
    };

    self.getFieldType = function (objectName, fieldName) {
      // Check if object exists
      if (isObjectExist(objectName)) {
        var field = self.getField(objectName, fieldName);
        // Check if field exists
        if (field) {
          if (field.type) {
            return field.type;
          }
          else if (field.collection) {
            return 'collection';
          }
          else {
            return 'object';
          }
        }
      }
      return '';
    };

    self.getObjectFields = function (objectName) {
      init();
      return _.find(self.newModelObject, {name: objectName}).fields;
    };

    self.addField = function (objectName, fieldName, fieldType, relatedObject, viaField) {
      init();
      if (fieldType == 'collection') {
        createCollectionField(self.newModelObject, fieldName, relatedObject, viaField, objectName);
      }
      else if (fieldType == 'object') {
        createObjectField(self.newModelObject, fieldName, objectName, viaField, relatedObject);
      }
      else {
        createSimpleField(self.newModelObject, fieldName, fieldType, objectName);
      }
    };

    self.deleteField = function (objectName, fieldName) {
      init();
      var object = _.find(self.newModelObject, {name: objectName});
      delete object.fields[fieldName];
      updateNewModel();
    };

    self.editField = function (objectName, fieldName, field, selectedFieldName) {
      init();
      var uneditedField = self.getField(objectName, fieldName);
      _.extend(uneditedField, field);
      handleFieldRename(objectName, fieldName, uneditedField, selectedFieldName);
      updateNewModel();
    };

    self.removeFieldsRelatingToObject = function (model, relatedObjectName) {
      init();
      model.forEach(function (object) {
        object.fields = _.pick(object.fields, function (value, key, object) {
          return value.collection != relatedObjectName && value.object != relatedObjectName;
        });
      });
      updateNewModel();
    };

    self.removeFieldsRelatingToField = function (objectName, relatedObjectName, relatedFieldName) {
      init();
      var object = _.find(self.newModelObject, {name: objectName});
      object.fields = _.pick(object.fields, function (value, key, object) {
        return !(value.collection == relatedObjectName && value.via == relatedFieldName);
      });
      updateNewModel();
    };

    self.getFieldRelatingToField = function (objectName, relatedObjectName, relatedFieldName) {
      init();
      var object = _.find(self.newModelObject, {name: objectName});
      var field = _.findKey(object.fields, function (object) {
        return object.collection == relatedObjectName && object.via == relatedFieldName;
      });
      return field;
    };

    self.getRelatedFieldsForObject = function (objectName) {
      init();
      var relatedFields = [];
      var object = _.find(self.newModelObject, {name: objectName});
      if (object) {
        _.forEach(object.fields, function (field) {
          if (field.object) {
            relatedFields.push(field.object);
          } else if (field.collection) {
            relatedFields.push(field.collection);
          }
        });
      }
      return relatedFields;
    };


    function createCollectionField(model, fieldName, relatedObject, viaField, objectName) {
      // Create field on the selected object
      var fieldToAdd = {};
      fieldToAdd[fieldName] = {collection: relatedObject, via: viaField};
      addGenericField(model, objectName, fieldToAdd);

      // Create field on the related object
      fieldToAdd = {};
      fieldToAdd[viaField] = {object: objectName};
      addGenericField(model, relatedObject, fieldToAdd);
    }

    function createObjectField(model, fieldName, objectName, viaField, relatedObject) {
      // Create field on the selected object
      var fieldToAdd = {};
      fieldToAdd[fieldName] = {object: relatedObject};
      addGenericField(model, objectName, fieldToAdd);

      // Create field on the related object
      fieldToAdd = {};
      fieldToAdd[viaField] = {collection: objectName, via: fieldName};
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

    function init() {
      self.newModel = DbDataModel.newModel;
      try {
        self.newModelObject = JSON.parse(self.newModel.schema);
      }
      catch (e) {
        // Fall back to previous model in case the JSON is malformed
        self.newModel = DbDataModel.currentModel;
        self.newModelObject = JSON.parse(self.newModel.schema);
      }
    }

    function updateNewModel() {
      DbDataModel.updateNewModel(AppsService.currentApp.Name, self.newModelObject);
    }

    function isObjectExist(objectName) {
      init();
      return _.some(self.newModelObject, function (object) {
        return object.name == objectName;
      });
    }

    function handleFieldRename(objectName, fieldName, field, newName) {
      if (fieldName == newName) {
        return;
      }
      // If field has already been renamed, change the rename property (don't have to create one)
      if (field.rename) {
        field.rename = newName;
      } else if (checkFieldExistInServer(objectName, fieldName)) {
        field.rename = newName;
      } else {
        var object = _.find(self.newModelObject, {name: objectName});
        delete object.fields[fieldName];
        object.fields[newName] = field;
      }
    }

    function checkFieldExistInServer(objectName, fieldName) {
      var serverModel = DbDataModel.currentModel;
      var serverObject = _.find(serverModel.json, {name: objectName});
      if (serverObject) {
        return serverObject.fields[fieldName];
      }
    }
  }
})();

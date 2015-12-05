(function () {
  'use strict';

  angular.module('common.services')
    .service('FieldsService', ['DbDataModel', FieldsService]);

  function FieldsService(DbDataModel){
    var self = this;

    self.newModel = DbDataModel.newModel;
    self.newModelObject = JSON.parse(self.newModel.schema);



    self.getField = function (objectName, fieldName) {
      var object = _.find(self.newModelObject, {name: objectName});
      return object.fields[fieldName];
    };

    self.addField = function (objectName, fieldName, fieldType, relatedObject, viaField) {
      if (fieldType == 'collection') {
        createCollectionField(self.newModelObject, fieldName, relatedObject, viaField, objectName);
      }
      else {
        createSimpleField(self.newModelObject, fieldName, fieldType, objectName);
      }
    };

    self.deleteField = function (objectName, fieldName) {
      var object = _.find(self.newModelObject, {name: objectName});
      delete object.fields[fieldName];
    };

    self.editField = function (objectName, field) {
      var uneditedField = self.getField(objectName, field.name);
      _.extend(uneditedField, field)
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
})();

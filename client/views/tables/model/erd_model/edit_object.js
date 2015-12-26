(function () {
  'use strict';
  angular.module('backand')
    .controller('EditObjectController', [
      '$modalInstance',
      'appName',
      'newModel',
      'objectName',
      'NotificationService',
      'FieldsService',
      EditObjectController
    ]);
  function EditObjectController(modalInstance, appName, newModel, objectName, NotificationService, FieldsService) {
    var self = this;
    self.appName = appName;
    self.newModel = newModel;
    self.objectName = objectName;
    self.editObjectForm = 'edit-object';
    self.isEdit = self.objectName;
    if (self.objectName) {
      self.selectedObjectName = self.objectName
    }

    self.addObject = function () {
      var newModelObject = JSON.parse(self.newModel.schema);

      if (_.some(newModelObject, function (object) {
          return object.name == self.selectedObjectName;
        })) {
        NotificationService.add('warning', 'Object already exists');
      } else {
        var objectToAdd = {name: self.selectedObjectName};
        if (!objectToAdd.fields) {
          objectToAdd['fields'] = {};
        }
        newModelObject.push(objectToAdd);

        modalInstance.close({model: newModelObject, objectName: self.selectedObjectName});
      }
    };

    self.editObject = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      var objectToEdit = _.where(newModelObject, {name: self.objectName})[0];
      objectToEdit.name = self.selectedObjectName;

      // Change object name in related objects
      _.each(newModelObject, function (object) {
        _.each(object.fields, function (field) {
          if (field.collection == self.objectName) {
            field.collection = self.selectedObjectName;
          }
        });
      });

      modalInstance.close({model: newModelObject});
    };

    self.deleteObject = function (objectName) {
      var newModel = JSON.parse(self.newModel.schema);
      newModel = _.reject(newModel, function (object) {
        return object.name == objectName;
      });

      // Remove fields related to the object
      FieldsService.removeFieldsRelatingToObject(newModel, objectName);

      modalInstance.close({model: newModel});
    };
  }
})();

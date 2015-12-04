(function () {
  'use strict';
  angular.module('backand')
    .controller('EditObjectController', [
      '$modalInstance',
      'appName',
      'newModel',
      'objectName',
      EditObjectController
    ]);
  function EditObjectController(modalInstance, appName, newModel, objectName) {
    var self = this;
    self.appName = appName;
    self.newModel = newModel;
    self.objectName = objectName;
    self.editObjectForm = 'edit-object';
    if (self.objectName) {
      self.selectedObjectName = self.objectName
    }

    self.addObject = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      var objectToAdd = {name: self.selectedObjectName};
      if (!objectToAdd.fields) {
        objectToAdd['fields'] = {};
      }
      newModelObject.push(objectToAdd);

      modalInstance.close({model: newModelObject});
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
    }
  }
})();

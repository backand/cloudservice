(function () {
  'use strict';
  angular.module('backand')
    .controller('AddObjectController', [
      '$modalInstance',
      'appName',
      'newModel',
      AddObjectController
    ]);
  function AddObjectController(modalInstance, appName, newModel) {
    var self = this;
    self.appName = appName;
    self.newModel = newModel;
    self.addObjectForm = 'add-object';

    self.addObject = function () {
      var newModelObject = JSON.parse(self.newModel.schema);
      var objectToAdd = {name: self.objectName};
      if (!objectToAdd.fields) {
        objectToAdd['fields'] = {};
      }
      newModelObject.push(objectToAdd);

      modalInstance.close({model: newModelObject});
    };
  }
})();

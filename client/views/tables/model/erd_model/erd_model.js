(function () {
  'use strict';
  angular.module('backand')
    .controller('ErdModelController', ['$scope', '$state', '$modal', 'AppsService', 'DbDataModel', 'TablesService', 'usSpinnerService', 'FieldsService', ErdModelController]);

  function ErdModelController($scope, $state, $modal, AppsService, DbDataModel, TablesService, usSpinnerService, FieldsService) {

    var self = this;

    //TODO: validate & save, maybe see output before saving? Also in json - see model before saving?
    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.showHelpDialog = false;
      self.currentModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;
      self.currentObject = $state.params.tableName;

      getSchema();
    }

    self.saveModel = function () {
      DbDataModel.saveErdModel(self.appName);
    };

    self.gotoObject = function (obj) {
      var table = TablesService.getTableByName(obj.data.name);
      if (table) {
        $state.go('object_fields', {
          tableName: obj.name,
          tableId: table.__metadata.id
        })
      }
    };

    self.reset = function () {
      DbDataModel.removeCustomSchema(self.appName);
      getSchema();
    };

    function getSchema() {
      usSpinnerService.spin('loading');
      DbDataModel.get(self.appName)
        .finally(function () {
          usSpinnerService.stop('loading');
        })
    }

    self.showHelp = function () {
      $scope.$emit('open-help');
    };

    self.editFieldDialog = function (tableName, fieldName) {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/model/erd_model/edit_field.html',
        controller: 'EditFieldController as EditField',
        resolve: {
          tableName: function () {
            return tableName;
          },
          fieldName: function () {
            return fieldName;
          },
          appName: function () {
            return self.appName;
          },
          newModel: function () {
            return self.newModel;
          }
        }
      });

      updateErdAfterModal(modalInstance);

    };

    self.editObjectDialog = function (objectName) {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/model/erd_model/edit_object.html',
        controller: 'EditObjectController as EditObject',
        resolve: {
          appName: function () {
            return self.appName;
          },
          newModel: function () {
            return self.newModel;
          },
          objectName: function () {
            return objectName;
          }
        }
      });

      updateErdAfterModal(modalInstance);
    };


    self.deleteObject = function (objectName) {
      var newModel = JSON.parse(DbDataModel.newModel.schema);
      newModel = _.reject(newModel, function (object) {
        return object.name == objectName;
      });

      // Remove fields related to the object
      FieldsService.removeFieldsRelatingToObject(objectName);

      self.updateErd(newModel);
    };

    function updateErdAfterModal(modalInstance) {
      modalInstance.result.then(function (result) {
        self.updateErd(result.model);
      });
    }

    self.updateErd = function (newModel) {
      if (!newModel) {
        newModel = FieldsService.newModelObject;
      }
      DbDataModel.updateNewModel(self.appName, newModel);
      // Refresh ERD
      $state.go($state.current, {}, {reload: true});
    };

    init();
  }

}());

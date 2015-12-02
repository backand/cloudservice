(function () {
  'use strict';
  angular.module('backand')
    .controller('ErdModelController', ['$scope', '$state', '$modal', 'AppsService', 'DbDataModel', 'TablesService', 'usSpinnerService', ErdModelController]);

  function ErdModelController($scope, $state, $modal, AppsService, DbDataModel, TablesService, usSpinnerService) {

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

    self.addObjectDialog = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/model/erd_model/add_object.html',
        controller: 'AddObjectController as AddObject',
        resolve: {
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

    function updateErdAfterModal(modalInstance) {
      modalInstance.result.then(function (result) {
        DbDataModel.updateNewModel(self.appName, result.model);
        // Refresh ERD
        $state.go($state.current, {}, {reload: true});
      });
    }

    init();
  }

}());

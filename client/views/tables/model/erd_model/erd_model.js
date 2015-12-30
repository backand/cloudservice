(function () {
  'use strict';
  angular.module('backand')
    .controller('ErdModelController', ['$scope', '$state', '$modal', 'AppsService', 'DbDataModel', 'TablesService', 'usSpinnerService', 'FieldsService', '$q', '$stateParams', ErdModelController]);

  function ErdModelController($scope, $state, $modal, AppsService, DbDataModel, TablesService, usSpinnerService, FieldsService, $q, $stateParams) {

    var self = this;

    //TODO: validate & save, maybe see output before saving? Also in json - see model before saving?
    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.showHelpDialog = false;
      self.currentModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;
      self.currentObject = $state.params.tableName;

      if ($stateParams.isNewObject) {
        self.editObjectDialog();
        $stateParams.isNewObject = false;
      }
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
          $scope.isUnsaved = self.currentModel.schema !== self.newModel.schema;
          if (!$scope.isChartReady) {
            $scope.isChartReady = true;
          }
          usSpinnerService.stop('loading');
        })
    }

    $scope.$root.$on("fetchTables", function () {
      $scope.isUnsaved = self.currentModel.schema !== self.newModel.schema;
    });

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
          },
          updateErd: function () {
            return self.updateErd;
          }
        }
      });

      updateErdAfterModal(modalInstance);

    };

    self.editObjectDialog = function (objectName) {
      var isEdit = objectName;
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

      if (isEdit) {
        updateErdAfterModal(modalInstance);
      } else {
        modalInstance.result.then(function (result) {
          self.updateErd(result.model).then(function () {
            var newObjectName = result.objectName;
            self.editFieldDialog(newObjectName);
          });
        });
      }
    };

    function updateErdAfterModal(modalInstance) {
      var deferred = $q.defer();
      modalInstance.result.then(function (result) {
        self.updateErd(result.model).then(function () {
          deferred.resolve();
        });
      });
      return deferred.promise;
    }

    self.updateErd = function (newModel) {
      var deferred = $q.defer();
      if (!newModel) {
        newModel = FieldsService.newModelObject;
      }
      DbDataModel.updateNewModel(self.appName, newModel);
      usSpinnerService.spin('loading');
      // Refresh ERD
      $state.go($state.current, {isNewObject: false}, {reload: true}).then(function () {
        usSpinnerService.stop('loading');
        deferred.resolve();
      });
      return deferred.promise;
    };

    init();
  }

}());

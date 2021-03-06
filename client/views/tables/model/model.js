  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ModelController', ['$scope', 'AppsService', 'DbDataModel', 'ModelService', 'usSpinnerService', 'NotificationService', '$modal', '$q', '$state', 'AnalyticsService', ModelController]);

  function ModelController($scope, AppsService, DbDataModel, ModelService, usSpinnerService, NotificationService, $modal, $q, $state, AnalyticsService) {

    var self = this;

    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.showHelpDialog = false;

      DbDataModel.init();
      self.oldModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;

      self.tabs = [
        {
          heading: 'Model Diagram',
          route: 'erd_model'
        },
        {
          heading: 'Model JSON',
          route: 'json_model'
        },

         {
           heading: 'Model Database',
           route: 'db_model'
         }

      ];
      
        getSchema();
      
    }

    $scope.$watch(function () {
      if (self.oldModel.schema !== self.newModel.schema) {
        return self.newModel.schema;
      }
    }, function(){
      $scope.isUnsaved = self.oldModel.schema !== self.newModel.schema;
    });

    self.showHelp = function (event) {
      self.showHelpDialog = true;
      if (event) {
        event.stopPropagation();
      }
    };

    $scope.$on('open-help', self.showHelp);

    self.closeHelp = function () {
      self.showHelpDialog = false;
      $scope.$broadcast('close-help');
    };

    self.reset = function(){
      DbDataModel.removeCustomSchema(self.appName);
      getSchema(true);
    };

    function getSchema (force) {
      usSpinnerService.spin('loading');
      DbDataModel.get(self.appName, force)
        .finally(function () {
          $scope.isUnsaved = self.oldModel.schema !== self.newModel.schema;
          usSpinnerService.stop('loading');
        })
    }

    self.saveSchema = function() {
      self.loading = true;
      if ($state.$current.self.name == 'erd_model'){
        AnalyticsService.track('UsedERD');
      } else if ($state.$current.self.name == 'json_model') {
        AnalyticsService.track('UsedJson');
      }

      try {
        var oldSchema = JSON.parse(self.oldModel.schema);
        var schema = JSON.parse(self.newModel.schema);
      } catch (err) {
        NotificationService.add('error', 'JSON is not properly formatted');
        self.loading = false;
        return;
      }

      ModelService.validate(self.appName, schema, oldSchema)
        .then(function (response) {
            self.loading = false;
            return openValidationModal(response)
        })
        .then(function (result) {
          if (result) {
            self.loading = true;
            return DbDataModel.update(self.appName, schema, true)
          }
          return $q.reject(null);
        })
        .then(function (data) {
          $scope.$root.$broadcast('fetchTables');
          self.loading = false;
          $scope.isUnsaved = false;
        })
        .catch(modelErrorHandler);
    };

    function openValidationModal (response) {

      var modalInstance = $modal.open({
        templateUrl: 'common/modals/confirm_update/confirm_update.html',
        controller: 'ConfirmModelUpdateController as ConfirmModelUpdate',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          validationResponse: function () {
            return response.data;
          },
          titles: function () {
            return {
              itemName: 'model',
              detailsTitle: 'The following operations will be performed:',
              resultProperty: 'alter'
            }
          }
        }
      });

      return modalInstance.result;
    }

    function modelErrorHandler (error, message) {
      getSchema();
      $scope.$root.$broadcast('fetchTables');
      self.loading = false;
      usSpinnerService.stop('loading');
    }

    init();
  }

}());

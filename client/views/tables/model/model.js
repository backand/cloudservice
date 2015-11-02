  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ModelController', ['$scope', 'AppsService', 'DbDataModel', 'ModelService', 'usSpinnerService', 'NotificationService', 'DatabaseService', '$modal', '$q', ModelController]);

  function ModelController($scope, AppsService, DbDataModel, ModelService, usSpinnerService, NotificationService, DatabaseService, $modal, $q) {

    var self = this;

    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.showHelpDialog = false;
      self.oldModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;

      self.tabs = [
        {
          heading: 'Json Code',
          route: 'json_model'
        },
        {
          heading: 'ERD',
          route: 'erd_model'
        }
      ];

      getSchema();
    }


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
      DatabaseService.removeCustomSchema(self.appName);
      getSchema();
    };

    function getSchema () {
      usSpinnerService.spin('loading');
      DbDataModel.get(self.appName)
        .finally(function () {
          usSpinnerService.stop('loading');
        })
    }

    self.saveSchema = function() {
      self.loading = true;

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
            return DbDataModel.update(self.appName, schema)
          }
          return $q.reject(null);
        })
        .then(function (data) {
          $scope.$root.$broadcast('fetchTables');
          self.loading = false;
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

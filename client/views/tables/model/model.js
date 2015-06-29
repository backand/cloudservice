  (function  () {
  'use strict';
  angular.module('backand')
    .controller('ModelController', ['$scope', 'AppsService', 'ModelService', 'usSpinnerService', 'NotificationService', 'DatabaseService', '$modal', ModelController]);

  function ModelController($scope, AppsService, ModelService, usSpinnerService, NotificationService, DatabaseService, $modal) {

    var self = this;

    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean'];
      self.schemaEditor = null;
      self.oldSchemaEditor = null;
      self.showHelpDialog = false;

      getSchema();
    }

    self.aceDiffOptions = {
      onLoad : function(editor) {
        editor.$blockScrolling = Infinity;
        editor.getSession().setTabSize(2);
      },
      theme:'ace/theme/monokai',
      mode: 'ace/mode/json',
      right: {
        editable: false
      },
      left: {
        copyLinkEnabled: false
      }
    };

    self.showHelp = function(){
      self.showHelpDialog = true;
    };

    function getSchema () {
      usSpinnerService.spin('loading');
      ModelService.get(self.appName)
        .then(function (data) {
          updateSchema(data);
          usSpinnerService.stop('loading');
        },
        errorHandler)
    }

    // save schema in local storage
    function saveCustomSchema (schema) {
      DatabaseService.saveCustomSchema(self.appName, schema);
    }

    $scope.$watch(function () {
      if (self.schemaEditor)
        return self.schemaEditor.getValue()
    }, saveCustomSchema);

    function updateSchema (data) {
      self.schema = angular.toJson(data.data, true);
      self.aceDiffOptions.right.content = self.schema;
      // get schema from local storage if exists
      self.aceDiffOptions.left.content = DatabaseService.getCustomSchema(self.appName) || self.schema;
      $scope.$root.$broadcast('ace-update');
    }

    self.insertTypeAtChar = function (param) {
      var tokenAtCursor = getTokenAtCursor();
      if (tokenAtCursor !== '""' && tokenAtCursor !== "''")
        param = '"' + param + '"';

      setTimeout(function() { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
        self.schemaEditor.insert(param);
      });
    };

    function getTokenAtCursor () {
      var position = self.schemaEditor.getCursorPosition();
      var token = self.schemaEditor.session.getTokenAt(position.row, position.column);
      if (token !== null) return token.value;
    }

    self.saveSchema = function() {
      self.loading = true;
      try {
        var oldSchema = JSON.parse(self.oldSchemaEditor.getValue());
        var schema = JSON.parse(self.schemaEditor.getValue());
      } catch (err) {
        NotificationService.add('error', 'JSON is not properly formatted');
        self.loading = false;
        return;
      }
      ModelService.validate(self.appName, schema, oldSchema)
        .then(function (response) {
          self.loading = false;
          openValidationModal(response)
            .then(function (result) {
            if (result) {
              self.loading = true;
              ModelService.update(self.appName, schema)
                .then(function (data) {
                  updateSchema(data);
                  $scope.$root.$broadcast('fetchTables');
                  self.loading = false;
                },
                modelErrorHandler)
            }
          }, modelErrorHandler)
        }
      )
    };

    function openValidationModal (response) {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/model/confirm_update.html',
        controller: 'ConfirmModelUpdateController as ConfirmModelUpdate',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          validationResponse: function () {
            return response.data;
          }
        }
      });

      return modalInstance.result;
    }

    function modelErrorHandler(error, message){
      getSchema();
      $scope.$root.$broadcast('fetchTables');
      self.loading = false;
      usSpinnerService.stop('loading');
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.loading = false;
      usSpinnerService.stop('loading');
    }

    init();
  }

}());

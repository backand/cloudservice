  (function  () {
  'use strict';
  angular.module('backand')
    .controller('JsonModelController', ['$scope', 'AppsService', 'DbDataModel', 'usSpinnerService', '$state', JsonModelController]);

  function JsonModelController($scope, AppsService, DbDataModel, usSpinnerService, $state) {

    var self = this;

    function init() {
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      self.fieldTypes = ['string', 'text', 'datetime', 'float', 'boolean'];
      self.schemaEditor = null;
      self.oldSchemaEditor = null;
      self.editorControl = {};
      self.showHelpDialog = false;
      self.showDiffs = true;
      self.oldModel = DbDataModel.currentModel;
      self.newModel = DbDataModel.newModel;

      try {
        JSON.parse(self.newModel.schema);
        getSchema(true);
      } catch (e) {
        //when Malformed json don't do anything
      }

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

    self.toggleShowDiff = function () {
      self.showDiffs = !self.showDiffs;
      self.differ.setOptions({showDiffs: self.showDiffs});
    };

    self.reset = function(){
      DbDataModel.removeCustomSchema(self.appName);
      getSchema(true);
      usSpinnerService.spin('loading');
      // Refresh
      $state.go($state.current, {}, {reload: true}).then(function () {
        usSpinnerService.stop('loading');
      });
      $scope.isUnsaved = false;
    };

    function getSchema (force) {
      usSpinnerService.spin('loading');
      DbDataModel.get(self.appName, force)
        .finally(function () {
          if(self.oldModel && self.newModel) {
            $scope.isUnsaved = self.oldModel.schema !== self.newModel.schema;
          }
          usSpinnerService.stop('loading');
        })
    }

    // save schema in local storage
    function saveCustomSchema (schema) {
      if (schema) {
        DbDataModel.saveCustomSchema(self.appName, schema);
      }
    }

    $scope.$watch(function () {
      if (self.oldModel.schema !== self.newModel.schema) {
        return self.newModel.schema;
      }
    }, saveCustomSchema);

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

    self.showHelp = function () {
      $scope.$emit('open-help');
    };

    $scope.$on('close-help', setCursorPosition);

    function setCursorPosition () {
      self.editorControl.gotoLine(self.schemaEditor);
    }

    init();
  }

}());

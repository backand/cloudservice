(function () {
  'use strict';
  angular.module('app.dbQueries')
    .controller('DbQueryController', [
      '$state',
      '$stateParams',
      'DbQueriesService',
      'ConfirmationPopup',
      'NotificationService',
      'DictionaryService',
      'SecurityService',
      'AppsService',
      DbQueryController]);

  function DbQueryController($state, $stateParams, DbQueriesService, ConfirmationPopup, NotificationService, DictionaryService, SecurityService, AppsService) {

    var self = this;
    self.namePattern = /^\w+$/;
    self.gridOptions = {virtualizationThreshold: 10};

    self.ace = {
      dbType: 'sql',
      onLoad: function(_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.copyUrlParams = {
      getUrl: getQueryUrl,
      getInputForm: getInputParametersForm,
      getTestForm: getQueryForm
    };

    function getInputParametersForm () {
      return self.inputParametersForm;
    }

    function getQueryForm () {
      return self.queryForm;
    }

    function getQueryUrl () {
      return self.queryUrl;
    }

    init();

    function init() {
      self.appName = $stateParams.name;
      self.inputValues = {};
      if (self.queryForm)
        self.queryForm.$setPristine();

      loadQueries();
      loadDbType();
    }

    function loadDbType() {
      AppsService.getCurrentApp(self.appName).then(function(app) {
        self.ace.dbType = (app.databaseName == 'mysql' && 'mysql' || 'pgsql');
      });
    }

    function loadQueries() {
      DbQueriesService.getQueries(self.appName).then(function () {
        self.openParamsModal = false;
        self.new = (!$stateParams.queryId);
        self.editMode = self.new;

        if (self.new) {
          self.query = DbQueriesService.getNewQuery();
        } else {
          self.query = DbQueriesService.getQueryForEdit($stateParams.queryId);
          if (typeof self.query == 'undefined') {
            $state.go('dbQueries.newQuery', {name: self.appName});
            return;
          }
        }
        self.currentST = String(self.query.workspaceID);
        SecurityService.appName = self.appName;
        loadRoles();
        getWorkspaces();
        populateDictionaryItems();
      });
    }

    function loadRoles() {
      SecurityService.getRoles()
        .then(function (data) {
          self.roles = data.data.data;
          if (self.query.allowSelectRoles)
            rolesToObj();
        })
    }

    function rolesToObj() {
      self.allowSelectRolesObject = {};
      var allowSelectRolesArray = self.query.allowSelectRoles.split(',');
      allowSelectRolesArray.forEach(function (role) {
        self.allowSelectRolesObject[role] = true;
      });
    }

    function rolesToString() {
      var allowSelectRolesArray = [];
      _.forOwn(self.allowSelectRolesObject, function (permission, role) {
        if (permission) allowSelectRolesArray.push(role);
      });
      self.query.allowSelectRoles = allowSelectRolesArray.join(',');
    }

    self.saveQuery = function () {
      self.loading = true;
      self.queryUrl = '';
      self.openParamsModal = false;
      self.query.workspaceID = Number(self.currentST);

      rolesToString();
      DbQueriesService.saveQuery(self.query)
        .then(reload);
    };

    function reload(query) {
      self.loading = false;
      if (query) {
        var params = {
          name: self.appName,
          queryId: query.__metadata.id
        };

        if (self.queryForm.params.$dirty)
          self.inputValues = {};

        self.queryForm.$setPristine();
        $state.go('dbQueries.query', params);
      }
    }


    self.editQuery = function () {
      self.editMode = true;
    };

    self.cancel = function () {
      if (self.queryForm.$pristine)
        init();
      else {
        ConfirmationPopup.confirm('Changes will be lost. Are sure you want to cancel editing?')
          .then(function (result) {
            result ? init() : false;
          });
      }
    };

    self.deleteQuery = function () {
      ConfirmationPopup.confirm('Are you sure you want to delete the query?')
        .then(function (result) {
          if (!result)
            return;
          DbQueriesService.deleteQuery(self.query)
            .then(function () {
              NotificationService.add('success', 'The query was deleted');
            }, function (error, message) {
              NotificationService.add('error', message);
            });
          $state.go('apps.show', {name: self.appName});
        })
    };

    /**
     * Read the list of workspaces
     */
    function getWorkspaces() {
      if (self.workspaces == null) {
        SecurityService.getWorkspace().then(workspaceSuccessHandler, errorHandler)
      }
    }

    /**
     * @param data
     * @constructor
     */
    function workspaceSuccessHandler(data) {
      self.workspaces = data.data.data;
    }


    function populateDictionaryItems() {
      DictionaryService.appName = self.appName;
      DictionaryService.tableName = 'v_durados_user'; //used just any table - we just need the system tokens

      DictionaryService.get().then(function (data) {
        var raw = data.data;
        var keys = Object.keys(raw);
        self.dictionaryItems = {
          headings: {
            tokens: keys[0],
            parameters: 'Parameters'
          },
          data: {
            tokens: raw[keys[0]],
            parameters: []
          }
        };
      });
    }

    self.toggleParametersModal = function () {
      self.openParamsModal = !self.openParamsModal;
    };

    self.insertParamAtChar = function (elementId, param) {
      setTimeout(function() { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
        self.ace.editor.insert("{{" + param + "}}");
      });
    };

    self.getParameters = function () {
      if (self.query) {
        return _.without(_.unique(self.query.parameters.replace(/ /g, '').split(',')),'');
      }
    };

    self.allowTest = function () {
      return self.query && self.query.__metadata && self.queryForm.$pristine;
    };

    self.testData = function () {
      if (!self.query.__metadata)
        return;
      self.testLoading = true;
      DbQueriesService.runQuery(self.appName, self.query.name, self.inputValues).then(successQueryHandler, errorHandler);
    };

    function successQueryHandler(data) {
      self.gridOptions.data = data.data;
      var columns = [];
      if (data.data.length > 0)
        columns = Object.keys(data.data[0]);
      self.gridOptions.columnDefs = columns.map(function (column) {
        return {
          minWidth: 80,
          name: column
        }
      });
      self.gridOptions.totalItems = data.data.length;

      self.queryUrl = DbQueriesService.getQueryUrl(self.query.name, self.inputValues);
      self.inputParametersForm.$setPristine();
      self.queryUrlCopied = false;

      self.testLoading = false;
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.testLoading = false;
    }

  }
}());

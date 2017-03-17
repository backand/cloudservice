(function () {
  'use strict';
  angular.module('backand.dbQueries')
    .controller('DbQueryController', [
      'CONSTS',
      '$state',
      '$stateParams',
      'DbQueriesService',
      'ConfirmationPopup',
      'NotificationService',
      'DictionaryService',
      'SecurityService',
      'AppsService',
      'EscapeSpecialChars',
      '$modal',
      '$window',
      DbQueryController]);

  function DbQueryController(CONSTS,
                             $state,
                             $stateParams,
                             DbQueriesService,
                             ConfirmationPopup,
                             NotificationService,
                             DictionaryService,
                             SecurityService,
                             AppsService,
                             EscapeSpecialChars,
                             $modal,
                             $window) {

    var self = this;
    self.namePattern = /^\w+$/;
    self.gridOptions = {virtualizationThreshold: 10};
    self.mode = 'nosql';
    self.dbType = 'sql';

      self.ace = {
      editors: {},
      onLoad: function (_editor) {
        self.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.copyUrlParams = {
      getUrl: getQueryUrl,
      getInputForm: getInputParametersForm,
      getTestForm: getQueryForm
    };

    self.copyHttpParams = {
      getUrl: getQueryHttp,
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

    function getQueryHttp () {
      return self.queryHttp;
    }

    init();

    function init() {
      self.appName = $stateParams.appName;
      if($stateParams.inputValues) {
        self.inputValues = $stateParams.inputValues;
      } else {
        self.inputValues = {};
      }
      if (self.queryForm)
        self.queryForm.$setPristine();
      loadQueries();
      loadDbType();
    }

    function loadDbType() {
      var app = AppsService.currentApp;
        self.dbType = (app.databaseName == 'mysql' && 'mysql' || 'pgsql');
    }

    function loadQueries() {
      DbQueriesService.getQueries(self.appName).then(function () {
        self.openParamsModal = false;
        self.new = $state.current.name === "dbQueries.newQuery";
        self.editMode = self.new || $state.current.name === "dbQueries.newSavedQuery";

        if (self.new) {
          self.query = DbQueriesService.getNewQuery();
        } else {
          self.query = DbQueriesService.getQueryForEdit($stateParams.queryId);
          if (typeof self.query == 'undefined') {
            $state.go('dbQueries.newQuery');
            return;
          }
          if (!self.query.noSQL && self.query.sQL) {
            self.mode = 'sql';
          }
          if ($stateParams.testData) {
            populateTestResults($stateParams.testData);
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

    self.changeModeToSql = function () {
      self.originalSql = self.query.sQL;
      self.mode = 'sql';
    };

    self.onEditSql = function () {
      if (self.query.noSQL) {
        ConfirmationPopup.confirm('The NoSQL query will be deleted. Do you want to continue editing the SQL query?')
          .then(function (confirm) {
            if (confirm) {
              self.query.noSQL = '';
              console.log('deleted nosql')
            } else {
              console.log('sql read only')
              self.query.sQL = self.originalSql;
              // read only remains for the editing session.
              // No need - when canceling and editing again - editing enabled and confirmation pop-ups again.
              //self.ace.editors.sql.setReadOnly(true);
            }
          });
      }
    };

    self.saveQuery = function (withTest) {
      self.loading = true;
      self.savingAndTesting = true;
      if (self.mode === 'sql') {
        return saveQuery(withTest).then(function(){
          if(withTest){
            self.testData();
          }
        });

      } else if (self.mode === 'nosql') {
        return saveNoSql().then(function(){
          if(withTest){
            self.testData();
          }
        });
      }
    };

    function saveQuery (isTest) {
      self.queryUrl = '';
      self.queryHttp = '';
      self.openParamsModal = false;
      self.query.workspaceID = Number(self.currentST);

      rolesToString();
      var queryToSend = EscapeSpecialChars(self.query);
      if(!isTest) {
        return DbQueriesService.saveQuery(queryToSend)
          .then(reload);
      } else {
        return DbQueriesService.saveQuery(queryToSend).then(function (data) {
          self.queryId = data.__metadata.id;
          self.loading = false;
        });
      }
    }

    function saveNoSql () {

      try {
        var json = _.isEmpty(self.query.noSQL) ?
          '' : JSON.parse(self.query.noSQL)
      } catch (error) {
        NotificationService.add('error', 'JSON is not properly formatted');
        self.loading = false;
        return;
      }

      //if noSQL is empty change mode and save as SQL
      if(json === ''){
        self.mode = 'sql';
        return saveQuery();
      }


      return DbQueriesService.transformNoSQL(json)
        .then(function (response) {
          if (response.data.valid === 'always') {
            self.query.sQL = self.transformedSql = response.data.sql;
            return saveQuery();
          } else {
            self.loading = false;
            self.transformedSql = response.data.sql;
            return openValidationModal(response)
            .then(function (result) {
              if (result) {
                self.query.sQL = self.transformedSql;
                return saveQuery();
              }
            })
          }
        })
    }

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
              itemName: 'query',
              detailsTitle: 'The NoSQL is equivalent to the following SQL query:',
              resultProperty: 'sql'
            }
          }
        }
      });

      return modalInstance.result;
    }

    function reload(query) {
      self.loading = false;
      if (query) {
        var params = {
          queryId: query.__metadata.id,
          testData: self.gridOptions.data
        };

        if (self.queryForm.params.$dirty)
          self.inputValues = {};

        self.queryForm.$setPristine();
        if(self.new || $state.current.name === "dbQueries.newSavedQuery"){
          $state.go('dbQueries.newSavedQuery', params);
        } else {
          $state.go('dbQueries.query', params);
        }
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

    self.showHelp = function(){
      $window.open('http://docs.backand.com/#queries', 'bkhelp');
    }

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
          $state.go('app.show');
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
      if (self.new && self.workspaces.length > 0) {
        self.currentST = self.workspaces[0].__metadata.id;
      }
    }


    function populateDictionaryItems() {
      DictionaryService.appName = self.appName;
      DictionaryService.tableName = CONSTS.backandUserObject; //used just any table - we just need the system tokens

      DictionaryService.get("read").then(function (data) {
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
        if(self.mode == 'nosql')
          self.ace.editors[self.mode].insert("\"\'{{" + param + "}}\'\"");
        else
          self.ace.editors[self.mode].insert("\'{{" + param + "}}\'");
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
      self.inputValues = _.pick(self.inputValues, self.getParameters());
      self.testError = null;
      self.testLoading = true;
      DbQueriesService.runQuery(self.query.name, self.inputValues)
        .then(successQueryHandler, errorHandler);
    };

    function successQueryHandler(data) {
      populateTestResults(data.data);
      var params = {
        queryId: self.queryId,
        testData: self.gridOptions.data,
        inputValues: self.inputValues
      };

      self.queryForm.$setPristine();
      if(self.new){
        $state.go('dbQueries.newSavedQuery', params);
      }
    }

    function populateTestResults(result) {
      self.gridOptions.data = result;
      self.jsonQueryTestResult = JSON.stringify(result, null, 2);
      var columns = [];
      if (result.length > 0)
        columns = Object.keys(result[0]);
      self.gridOptions.columnDefs = columns.map(function (column) {
        return {
          minWidth: 80,
          name: column
        }
      });
      self.gridOptions.totalItems = result.length;

      self.queryUrl = DbQueriesService.getQueryUrl(self.query.name, self.inputValues, true);
      // GENERATOR ADDON
      self.httpObject = DbQueriesService.getQueryHttp(self.query.name, self.inputValues);
      // END
      self.queryHttp = stringifyHttp(DbQueriesService.getQueryHttp(self.query.name, self.inputValues));
      if (self.inputParametersForm) {
        self.inputParametersForm.$setPristine();
      }
      self.queryUrlCopied = false;

      self.testLoading = false;
      self.savingAndTesting = false;
    }

    function stringifyHttp (http) {
      var stringifiedHttp = 'return $http (' + angular.toJson(http, true) + ');';
      stringifiedHttp = stringifiedHttp.replace(/"([\d\w\s]+)"\s*:/g, '$1:');
      stringifiedHttp = stringifiedHttp.replace(/"/g, "'");
      stringifiedHttp = stringifiedHttp.replace("'https://api.backand.com", "Backand.getApiUrl() + '");

      return stringifiedHttp;
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.testError = error.data;
      self.testLoading = false;
      self.savingAndTesting = false;
    }

  }
}());

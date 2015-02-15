(function () {
  'use strict';
  angular.module('app.dbQueries')
    .controller('DbQueryController', ['$scope', '$state', '$stateParams', 'DbQueriesService', 'ConfirmationPopup', 'NotificationService', 'DictionaryService', 'SecurityService', DbQueryController]);

  function DbQueryController($scope, $state, $stateParams, DbQueriesService, ConfirmationPopup, NotificationService, DictionaryService, SecurityService) {
    var self = this;

    init();


    function init() {
      self.appName = $stateParams.name;
      self.allowTest = true;
      self.inputValues = {};
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
        getParameters();
      });
    }

    function loadRoles() {
      SecurityService.getRoles()
        .then(function (data) {
          self.roles = data.data.data;
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
      self.openParamsModal = false;
      self.query.workspaceID = Number(self.currentST);


      rolesToString();
      DbQueriesService.saveQuery(self.query)
        .then(function (query) {
          self.loading = false;
          var params = {
            name: self.appName,
            queryId: query.__metadata.id
          };
          getParameters();
          self.allowTest = true;
          $state.go('dbQueries.query', params);
        });

    };

    self.editQuery = function () {
      self.editMode = true;
      populateDictionaryItems();
    };

    self.cancel = function () {
      ConfirmationPopup.confirm('Changes will be lost. Are sure you want to cancel editing?')
        .then(function (result) {
          result ? init() : false;
        });
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
      $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, param]);
    };

    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }

    self.getDicParameters = function () {
      return self.query.parameters.replace(/ /g, '').split(',');
    }


    var paramRegex = /{{([^}]*)}}/g; //anything between '{{' and '}}' except '}'
    function getParameters() {
      if (self.query) {
        var paramsMatch = self.query.parameters.replace(/ /g, '').split(',');
        var queryMatch = [];
        var queryMatchWithBrackets = self.query.sQL.match(paramRegex);
        if (queryMatchWithBrackets != null)
          queryMatchWithBrackets.forEach(function (match) {
            queryMatch.push(match.substring(2, match.length - 2).replace(/ /g, ''));
          });

        var parameters = _.union(paramsMatch, queryMatch);
        self.query.parameters = parameters.join(',');
        self.inputParameters = parameters;
      }
    }

    self.testData = function () {
      $scope.$broadcast('tabs:data', {"query": self.query.name, "app": self.appName, "parameters": self.inputValues});
    }

    self.clearData = function () {
      self.allowTest = false;
      $scope.$broadcast('clearData');
    }
  }
}());

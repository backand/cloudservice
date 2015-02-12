
(function  () {
  'use strict';
  angular.module('app.dbQueries')
    .controller('DbQueryController', ['$scope', '$state', '$stateParams', 'DbQueriesService', 'ConfirmationPopup', 'NotificationService', 'DictionaryService', DbQueryController]);

  function DbQueryController($scope, $state, $stateParams, DbQueriesService, ConfirmationPopup, NotificationService, DictionaryService) {
    var self = this;
    init();


    function init() {
      DbQueriesService.getQueries($stateParams.name).then(function() {
        self.openParamsModal = false;
        self.new = (!$stateParams.queryId);
        self.editMode = self.new;
        if (self.new) {
          self.query = DbQueriesService.getNewQuery();
        } else {
          self.query = DbQueriesService.getQueryForEdit($stateParams.queryId);
          if (typeof self.query == 'undefined') {
            $state.go('dbQueries.newQuery', {name: $stateParams.name});
            return;
          }
        }
        self.roles = ['Admin', 'Public', 'User'];
        rolesToObj();

      });
    }

    function rolesToObj() {
      self.allowSelectRolesObject = {};
      var allowSelectRolesArray = self.query.allowSelectRoles.split(',');
      allowSelectRolesArray.forEach(function(role) {
        self.allowSelectRolesObject[role] = true;
      });
    }

    function rolesToString() {
      var allowSelectRolesArray = [];
      _.forOwn(self.allowSelectRolesObject, function(permission, role) {
        if (permission) allowSelectRolesArray.push(role);
      });
      self.query.allowSelectRoles = allowSelectRolesArray.join(',');
    }

    this.saveQuery = function () {
      //TODO: spinner start
      self.openParamsModal = false;
      rolesToString();
      DbQueriesService.saveQuery(self.query)
        .then(function (query) {
          self.editMode = false;
          //TODO: spinner stop
          var params = {
            name: $stateParams.name,
            queryId: query.__metadata.id
          };
          $state.go('dbQueries.query', params);
        });

    };

    this.editQuery = function () {
      self.editMode = true;
      //populateDictionaryItems();
    };

    this.cancel = function () {
      ConfirmationPopup.confirm('Changes will be lost. Are sure you want to cancel editing?')
        .then(function(result){
          result ? init() : false;
        });
    };

    this.deleteQuery = function () {
      ConfirmationPopup.confirm('Are you sure you want to delete the query?')
        .then(function (result) {
          if (!result)
            return;
          DbQueriesService.deleteQuery(self.query)
            .then(function() {
              NotificationService.add('success', 'The query was deleted');
            }, function(error, message) {
              NotificationService.add('error', message);
            });
          $state.go('apps.show', {name: $stateParams.name});
        })
    };


    function populateDictionaryItems() {
      DictionaryService.get().then(function (data) {
        var raw = data.data;
        var keys = Object.keys(raw);
        this.dictionaryItems = {
          headings: {
            tokens: keys[0],
            props: keys[1],
            parameters: 'Parameters'
          },
          data: {
            tokens: raw[keys[0]],
            props: raw[keys[1]],
            parameters: []
          }
        };
      });
    }

    this.toggleParametersModal = function () {
      self.openParamsModal = !self.openParamsModal;
    };

    this.insertParamAtChar = function (elementId, param) {
      $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, param]);
    };

    var paramRegex = /{{([^}]*)}}/g; //anything between '{{' and '}}' except '}'
    this.getParameters = function () {
      if (self.query) {
        var paramsMatch = self.query.parameters.replace(/ /g, '').split(',');
        var queryMatch = [];
        var queryMatchWithBrackets = self.query.sQL.match(paramRegex);
        if (queryMatchWithBrackets != null)
          queryMatchWithBrackets.forEach(function (match) {
            queryMatch.push(match.substring(2, match.length-2).replace(/ /g, ''));
          });

        var parameters = _.union(paramsMatch, queryMatch);
        self.query.parameters = parameters.join(',');
        return parameters;
      }
    }

  }
}());

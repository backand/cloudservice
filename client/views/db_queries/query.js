
(function  () {
  'use strict';
  angular.module('app.dbQueries')
    .controller('DbQueryController', ['$state', '$stateParams', 'DbQueriesService', 'ConfirmationPopup', 'NotificationService', DbQueryController]);

  function DbQueryController($state, $stateParams, DbQueriesService, ConfirmationPopup, NotificationService) {
    var self = this;
    init();


    function init() {
      DbQueriesService.getQueries($stateParams.name).then(function() {
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

    self.saveOrEdit = function () {
      if (self.editMode) {
        saveQuery();
      }
      else {
        editQuery();
      }
      self.editMode = !self.editMode;
    };

    function saveQuery() {
      rolesToString();
      DbQueriesService.saveQuery(self.query)
        .then(function (query) {
          var params = {
            name: $stateParams.name,
            queryId: query.__metadata.id
          };
          $state.go('dbQueries.query', params);
        });

    }

    function editQuery() {
    }

    self.cancel = function () {
      ConfirmationPopup.confirm('Changes will be lost. Are sure you want to cancel editing?')
        .then(function(result){
          result ? init() : false;
        });
    };

    self.deleteQuery = function () {
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

  }
}());

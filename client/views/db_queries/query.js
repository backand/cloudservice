
(function  () {
  'use strict';
  angular.module('app.dbQueries')
    .controller('DbQueryController', ['$stateParams', 'DbQueriesService', 'ConfirmationPopup', DbQueryController]);

  function DbQueryController($stateParams, DbQueriesService, ConfirmationPopup) {
    var self = this;
    init();


    function init() {
      DbQueriesService.get($stateParams.name).then(function() {
        self.queryOriginal = DbQueriesService.getQuery($stateParams.queryId);
        self.query = angular.copy(self.queryOriginal);
        self.roles = ['Admin', 'Public', 'User'];
        self.allowSelectRolesArray = self.query.allowSelectRoles.split(',');
        self.allowSelectRolesObject = {};
        self.allowSelectRolesArray.forEach(function(role) {
          self.allowSelectRolesObject[role] = true;
        });
      });

      self.editMode = (!$stateParams.queryId);
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
      self.allowSelectRolesArray = [];
      _.forOwn(self.allowSelectRolesObject, function(permission, role) {
        if (permission) self.allowSelectRolesArray.push(role);
      });
      self.query.allowSelectRoles = _(self.allowSelectRolesArray).toString();
      DbQueriesService.saveQuery(self.query);
    }

    function editQuery() {
    }

    self.cancel = function () {
      ConfirmationPopup.confirm('Changes will be lost. are sure you want to cancel editing?')
        .then(function(result){
          result ? init() : false;
        });
    }

  }
}());

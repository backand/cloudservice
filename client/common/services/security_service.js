(function () {
  'use strict';

  function SecurityService($http, CONSTS) {
    var self = this;
    self.appName = null;
    self.usersTableName = CONSTS.backandUserObject;
    self.rolesTableName = CONSTS.backandRoleObject;
    self.workspaceTableName = '/1/workspace';
    self.dbDataUrl = '/1/table/data/';

    function getHttp (method, isConfig, tableName, id){
      var url = (isConfig) ? '' : self.dbDataUrl;
      return {
        method: method,
        url: CONSTS.appUrl + url + tableName + (id ? '/' + id : ''),
        headers: { AppName: self.appName }
      }
    }

    self.getData = function (tableName, size, page, sort, isConfig, filter) {
      var sortParam = '';
      var filterParam = filter || '';
      size = !size ? 20 : size;
      page = !page ? 1 : page;
      if (sort)
        sortParam = sort;

      var http = getHttp('GET', isConfig, tableName);
      http.params = {
        'pageSize': String(size),
        'pageNumber': String(page),
        'sort': sortParam,
        'filter': filterParam
      };
      return $http(http);
    };

    self.updateData = function (tableName, rowData, pk, isConfig) {
      var id = (!pk) ? rowData.ID : pk;
      var http = getHttp('PUT', isConfig, tableName, id);
      http.data = rowData;
      return $http(http);
    };

    self.postData = function (tableName, rowData, isConfig) {
      var http = getHttp('POST', isConfig, tableName);
      http.data = rowData;
      return $http(http);
    };

    self.deleteData = function (tableName, Id, isConfig) {
      return $http(getHttp('DELETE', isConfig, tableName, Id));
    };

    self.getUsers = function (size, page, sort, filter) {

      return self.getData(self.usersTableName, size, page, '[{fieldName:"Username", order:"asc"}]', '', filter)
    };

    self.getRoles = function () {
      return self.getData(self.rolesTableName)
    };

    self.updateUser = function (user) {
      return self.updateData(self.usersTableName, user);
    };
    self.updateRole = function (role, pk) {

      return self.updateData(self.rolesTableName, role, pk);
    };

    self.postUser = function (user) {
      return self.postData(self.usersTableName, user);
    };
    self.postRole = function (role) {

      return self.postData(self.rolesTableName, role);
    };

    self.deleteUser = function (Id) {
      return self.deleteData(self.usersTableName, Id);
    };
    self.deleteRole = function (Id) {
      return self.deleteData(self.rolesTableName, Id);
    };

    self.getWorkspace = function (size, page, sort) {
      return self.getData(self.workspaceTableName, null, null, '[{fieldName:"name", order:"asc"}]', true);

    };
    self.postWorkspace = function (workspace) {
      return self.postData(self.workspaceTableName, workspace, true);

    };

    self.updateWorkspace = function (workspace) {
      return self.updateData(self.workspaceTableName, workspace, workspace.__metadata.id, true);

    };
  }

  angular.module('common.services')
    .service('SecurityService', ['$http', 'CONSTS', SecurityService]);
})();

(function () {
  'use strict';

  function SecurityService($http, CONSTS) {
    var self = this;
    self.appName = null;
    self.usersTableName = CONSTS.backandUserObject;
    self.rolesTableName = CONSTS.backandRoleObject;
    self.workspaceTableName = '/1/workspace';
    self.dbDataUrl = '/1/table/data/';
    self.userUrl = '/1/user';

    function getHttp (method, isConfig, tableName, id){
      var url = (isConfig) ? '' : self.dbDataUrl;
      return {
        method: method,
        url: CONSTS.appUrl + url + tableName + (id ? '/' + id : ''),
        headers: { AppName: self.appName }
      }
    }

    self.getData = function (tableName, size, page, sort, isConfig, filter) {
      sort = sort || '';
      filter = filter || '';
      size = size || 20;
      page = page || 1;

      var http = getHttp('GET', isConfig, tableName);

      http.params = {
        'pageSize': String(size),
        'pageNumber': String(page),
        'sort': sort,
        'filter': filter
      };
      return $http(http);
    };

    self.updateData = function (tableName, rowData, id, isConfig) {
      id = id || rowData.ID;
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

    self.newUser = function (user) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + self.userUrl,
        headers: { AppName: self.appName },
        data: user
      })
    };

    self.userExists = function (username) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + self.userUrl + '/exists',
        headers: { AppName: self.appName },
        params: {
          username: username
        }
      })
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

    self.setUserPassword = function (userData) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + self.userUrl + '/password',
        headers: { AppName: self.appName },
        data: userData
      });
    };

    self.getUserToken = function (username) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + self.userUrl + '/key',
        headers: { AppName: self.appName },
        params: {
          username: username
        }
      })
    };

    self.resetUserToken = function (username) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + self.userUrl + '/key/reset',
        headers: { AppName: self.appName },
        params: {
          username: username
        }
      })
    };

    self.getFilterCode = function (objectToUpdate, usersObject, emailField) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/predefined/' + objectToUpdate,
        params: {
          usersObjectName: usersObject,
          emailFieldName: emailField,
          maxLevel: 3
        },
        headers: { AppName: self.appName }
      })
    };

    self.transformNoSQL = function (json) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/nosql/transform',
        data: json,
        headers: { AppName: self.appName }
      });
    };

  }

  angular.module('common.services')
    .service('SecurityService', ['$http', 'CONSTS', SecurityService]);
})();

(function () {
  'use strict';

  function SecurityService($http, $q, CONSTS) {
    var self = this;
    self.appName = null;
    self.usersTableName = 'v_durados_user';
    self.rolesTableName = 'durados_UserRole';
    self.pageSize = 20;

    self.getData = function (tableName,size, page,  sort) {
      var sortParam = '[{fieldName:"id", order:"desc"}]';
      var def_size = !size? 20 : size;
      var page = !page ? 1 : page;
      if(sort)
        sortParam = sort;
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/' + tableName + '?pageSize=' + String(self.pageSize),
        headers: {AppName: self.appName},
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'sort' : sortParam
        }
      });
    };

    self.updateData = function (tableName, rowData) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/table/data/' + tableName + '/' + rowData.ID,
        headers: {AppName: self.appName},
        data: rowData
      });
    };

    self.postData = function (tableName, rowData) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/table/data/' + tableName + '/',
        headers: {AppName: self.appName},
        data: rowData
      });
    };

    self.deleteData = function (tableName, Id) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/table/data/' + tableName + '/' + Id,
        headers: {AppName: self.appName}

      });
    };

    self.getUsers = function ( size, page,  sort) {

      return self.getData(self.usersTableName,size, page,  sort)
    };

    self.getRoles = function () {
      return self.getData(self.rolesTableName)
    };

    self.updateUser = function (user) {
      return self.updateData(self.usersTableName, user);
    };
    self.updateRole = function (role) {

       return self.updateData(self.rolesTableName, role);
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
  }

  angular.module('common.services')
    .service('SecurityService', ['$http', '$q', 'CONSTS', SecurityService]);
})();

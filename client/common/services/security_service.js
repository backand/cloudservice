(function () {
  'use strict';

  function SecurityService($http, $q, CONSTS) {
    var self = this;
    self.appName = null;
    self.usersTableName = 'v_durados_user';
    self.rolesTableName = 'durados_UserRole';
    self.workspaceTableName ='/1/workspace';
    self.dbDataUrl ='/1/table/data/';


    self.getData = function (tableName, size, page,  sort,isConfig) {
      var sortParam = '[{fieldName:"id", order:"desc"}]';
     var url =(isConfig)?'':self.dbDataUrl;
      size = !size? 20 : size;
      page = !page ? 1 : page;
      if(sort)
        sortParam = sort;
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + url + tableName,
        headers: {AppName: self.appName},
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'sort' : sortParam
        }
      });
    };

    self.updateData = function (tableName, rowData,pk,isConfig ) {
      var url =(isConfig)?'':self.dbDataUrl;
      var id=(!pk)?rowData.ID:pk;
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl +url + tableName + '/' + id ,
        headers: {AppName: self.appName},
        data: rowData
      });
    };

    self.postData = function (tableName, rowData,isConfig) {
      var url =(isConfig)?'':self.dbDataUrl;
      return $http({
        method: 'POST',
        url: CONSTS.appUrl +url + tableName + '/',
        headers: {AppName: self.appName},
        data: rowData
      });
    };

    self.deleteData = function (tableName, Id,isConfig) {
      var url =(isConfig)?'':self.dbDataUrl;
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + url + tableName + '/' + Id,
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

    self.getWorkspace = function (size, page, sort) {
      return self.getData(self.workspaceTableName,null,null,'[{fieldName:"name", order:"asc"}]',true);

    };
    self.postWorkspace = function (workspace) {
      return self.postData(self.workspaceTableName,workspace,true);

    };

    self.updateWorkspace = function (workspace) {
      return self.updateData(self.workspaceTableName,workspace,workspace.__metadata.id,true);

    };
  }

  angular.module('common.services')
    .service('SecurityService', ['$http', '$q', 'CONSTS', SecurityService]);
})();

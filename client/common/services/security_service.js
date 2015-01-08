(function() {
  'use strict';

  function SecurityService($http, $q, CONSTS) {

    this.getData = function(appName, pageSize,tableName){
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/'+tableName+'?pageSize='+String(pageSize),
        headers: {
          'AppName': appName
        },
        params: {
          'sort' : '[{fieldName:"id", order:"desc"}]'
        }
      });
    };

    this.getUsers = function(appName, pageSize){
      return this.getData(appName, pageSize,'v_durados_User')

    };
    this.getRoles = function(appName, pageSize){
      return this.getData(appName, pageSize,'durados_UserRole')

    };
    this.update = function(appName, tableName ,rowData){
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/table/data/'+tableName+'/'+rowData.ID,
        headers: {
          'AppName': appName
        },
        data:rowData
      });
    };
    this.post = function(appName, tableName ,rowData){
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/table/data/'+tableName+'/',
        headers: {
          'AppName': appName
        },
        data:rowData
      });
    };

  }

  angular.module('common.services')
    .service('SecurityService', ['$http', '$q', 'CONSTS', SecurityService]);
})();

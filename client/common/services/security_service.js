(function() {
  'use strict';

  function SecurityService($http, $q, CONSTS) {

    this.getUsers = function(appName, pageSize){
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/v_durados_User?pageSize='+String(pageSize),
        headers: {
          'AppName': appName
        },
        params: {
          'sort' : '[{fieldName:"id", order:"desc"}]'
        }
      });
    };


  }

  angular.module('common.services')
    .service('SecurityService', ['$http', '$q', 'CONSTS', SecurityService]);
})();

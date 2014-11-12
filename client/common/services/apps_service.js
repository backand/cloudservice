(function() {
  'use strict';

  function appsService($http) {

    this.all = function(){
      return $http({
          method: 'GET',
          url: '/api/admin/myApps'
        });
    };

    this.find = function(appName){
      return $http({
        method: 'GET',
        url: '/api/admin/myApps/'+appName
      });
    };

    this.connect2DB = function(appName){
      return $http({
        method: 'PUT',
        data: '',
        url: '/api/admin/myApps/'+appName
      });
    };
  };

  angular.module('common.services')
    .service('AppsService',['$http', appsService]);

})();

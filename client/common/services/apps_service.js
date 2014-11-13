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

    this.add = function(name ,title){
      return $http({
        method: 'POST',
        url: '/api/admin/myApps/',
        data: {
                Name: name,
                Title: title
              }
      });
    };

    this.update= function(name,title){
      return $http({
        method: 'PUT',
        url: '/api/admin/myApps/'+name,
        data: {
          Name: name,
          Title: title
        }
      });
    };

    this.connect2DB = function(appName){
      return $http({
        method: 'PUT',
        url: '/api/admin/myApps/'+appName,
        data: ''
      });
    };
  };

  angular.module('common.services')
    .service('AppsService',['$http', appsService]);

})();

(function() {
  'use strict';

  function appsService($http, CONSTS) {

    this.all = function(){
      return $http({
          method: 'GET',
          url: CONSTS.appUrl + '/admin/myApps'
        });
    };

    this.find = function(appName){
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/'+appName
      });
    };

    this.add = function(name ,title){
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myApps/',
        data: {
                Name: name,
                Title: title
              }
      });
    };

    this.update= function(name,title){
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+name,
        data: {
          Name: name,
          Title: title
        }
      });
    };

    this.connect2DB = function(appName){
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+appName,
        data: ''
      });
    };
  };

  angular.module('common.services')
    .service('AppsService',['$http', 'CONSTS', appsService]);

})();

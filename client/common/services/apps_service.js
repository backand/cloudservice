(function() {
  'use strict';

  function appsService($http) {
    var apps = [
      {
        id: '241',
        os: 'Android',
        name: 'AutoDesk360',
        desc: 'Super 4D'
      },
      {
        id: '412',
        os: 'iOS',
        name: 'AutoDesk360',
        desc: 'Best app ever'
      },
      {
        id: '143',
        os: 'Android',
        name: 'AutoCad',
        desc: 'On android too !'
      }
    ];

    this.getAllApps = function(){
      //console.log(AuthService.currentUser.access_token);
      return $http({
          method: 'GET',
          url: '/api/admin/myApps'
        });
    };

    this.getSingleApp = function(appName){
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

    this.get = function(id) {
      var rc = null;
      angular.forEach(apps, function(value, key) {
        if (value.id === id)
          rc = apps[key];
      });
      return rc;
    }
  };

  angular.module('common.services')
    .service('AppsService',['$http', appsService]);

})();

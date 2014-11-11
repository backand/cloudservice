(function() {
  'use strict';

  function appsService(AuthService,$http) {
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
      console.log(AuthService.currentUser.access_token);
      return $http({
          method: 'GET',
          url: '/api/admin/myApps',
          headers: {
            Accept: 'application/json',
            'Content-Type' :'application/json',
            Authorization : 'bearer'+ AuthService.currentUser.access_token}
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
    .service('AppsService',['AuthService','$http', appsService]);

})();

(function() {
  'use strict';

  function appsService() {
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

    return {
      all: function() {
        return apps;
      },

      get: function(id) {
        var rc = null;
        angular.forEach(apps, function(value, key) {
          if (value.id === id)
            rc = apps[key];
        });
        return rc;
      }
    };
  };

  angular.module('services')
    .factory('AppsService', appsService);

})();

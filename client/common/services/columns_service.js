(function() {
  'use strict';

  function ColumnsService($http, $q, CONSTS, NotificationService, $log) {

    this.sync = function(appName) {
        return $http({
            method: 'GET',
            url: CONSTS.appUrl + '/1/app/sync',
            headers: { AppName: appName }
        });
    };

    this.get = function(appName, tableName) {
      $log.debug("columns get", appName, tableName);
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/config/' + tableName,
        headers: { AppName: appName },
        params: {
            filter: null,
            sort: null
        }
      });
    };
  }

  angular.module('common.services')
    .service('ColumnsService', ['$http', '$q', 'CONSTS', 'NotificationService', '$log', ColumnsService]);
})();

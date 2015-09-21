(function() {
  'use strict';

  function ObjectsService($http, AppsService, CONSTS) {

    var self = this;

    self.getObject = function (tableName, objectId, ignoreError) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + objectId,
        headers: { AppName: AppsService.currentApp.Name },
        config: {ignoreError: ignoreError}
      });
    };



  }

  angular.module('common.services')
    .service('ObjectsService', ['$http', 'AppsService', 'CONSTS', ObjectsService]);
})();

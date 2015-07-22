(function() {
  'use strict';

  function ObjectsService($http, CONSTS) {

    var self = this;

    self.getObject = function (appName, tableName, objectId) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + objectId,
        headers: { AppName: appName }
      });
    };



  }

  angular.module('common.services')
    .service('ObjectsService', ['$http', 'CONSTS', ObjectsService]);
})();

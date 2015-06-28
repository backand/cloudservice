(function() {
  'use strict';

  function ModelService(CONSTS, $http) {

    var self = this;

    self.get = function (appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/model',
        headers: { AppName: appName }
      });
    };

    self.update = function (appName, schema) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/model',
        headers: { AppName: appName },
        data: {newSchema: schema, severity: 0}
      });
    };

    self.validate = function (appName, schema, oldSchema) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/model/validate',
        headers: { AppName: appName },
        data: {newSchema: schema, oldSchema: oldSchema, severity: 0}
      });
    };

  }

  angular.module('common.services')
    .service('ModelService',['CONSTS', '$http', ModelService]);

})();

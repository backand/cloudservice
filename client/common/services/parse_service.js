(function () {
  'use strict';

  angular.module('common.services')
    .service('ParseService', ['$http', 'CONSTS', ParseService]);

  function ParseService($http, CONSTS) {

    var self = this;

    self.get = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/parse/',
      });
    };

    self.post = function (parseUrl, parseSchema) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/parse/',
        data: {
          parseUrl: parseUrl,
          parseSchema: parseSchema
        }
      })
    }
  }

})();

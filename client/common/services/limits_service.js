(function () {
  angular.module('common.services')
    .service('LimitsService', ['$http', 'CONSTS', LimitsService]);

  function LimitsService($http, CONSTS) {
    var self = this;
    self.appName = null;
    var LIMITS_URL = '/1/admin/limits';

    self.get = function (limit) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + LIMITS_URL + '/' + limit,
        headers: {AppName: self.appName}
      });
    };


  }
})();

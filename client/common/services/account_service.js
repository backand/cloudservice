(function () {
  'use strict';

  angular.module('common.services')
    .service('AccountService', ['$http', 'SessionService', 'CONSTS', AccountService]);

  function AccountService($http, SessionService, CONSTS) {

    var self = this;

    self.delete = function () {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/user/backand'
      });
    };
  }

})();

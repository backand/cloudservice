(function () {
  'use strict';

  angular.module('common.services')
    .service('AccountService', ['$http', 'SessionService']);

  function AccountService($http, SessionService) {

    var self = this;

    self.delete = function () {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/user/backand?username=' + SessionService.currentUser
      });
    };
  }

})();

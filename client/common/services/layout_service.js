(function() {
  'use strict';

  function LayoutService($localStorage, AuthService) {

    var self = this;

    self.showJumbo = function () {
      return !$localStorage.backand.hideJumbo;
    };

    self.closeJumbo = function () {
      $localStorage.backand[AuthService.getUserId()].hideJumbo = true;
    };

    self.openJumbo = function () {
      $localStorage.backand[AuthService.getUserId()].hideJumbo = false;
    };

  }

  angular.module('common.services')
    .service('LayoutService',['$localStorage', 'AuthService', LayoutService]);

})();

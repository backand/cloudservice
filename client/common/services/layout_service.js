(function() {
  'use strict';

  function LayoutService($localStorage, AuthService) {

    var self = this;
    $localStorage.backand[AuthService.getUserId()] =
      $localStorage.backand[AuthService.getUserId()] || {};

    self.showJumbo = function () {
      return !$localStorage.backand[AuthService.getUserId()].hideJumbo;
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

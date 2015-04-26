(function() {
  'use strict';

  function LayoutService($localStorage, AuthService) {

    var self = this;
    $localStorage.backand = $localStorage.backand || {};
    $localStorage.backand[AuthService.getUserId()] = $localStorage.backand[AuthService.getUserId()] || {};

    self.showJumbo = function () {
        $localStorage.backand = $localStorage.backand || {};
        if(!$localStorage.backand[AuthService.getUserId()] || !angular.isDefined($localStorage.backand[AuthService.getUserId()].hideJumbo)){
          $localStorage.backand[AuthService.getUserId()] = $localStorage.backand[AuthService.getUserId()] || {};
          self.openJumbo();
        }

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

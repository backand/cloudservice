(function() {
  'use strict';

  function LayoutService($localStorage) {

    var self = this;

    self.showJumbo = function () {
      return !$localStorage.backand.hideJumbo;
    };

    self.closeJumbo = function () {
      $localStorage.backand.hideJumbo = true;
    };

    self.openJumbo = function () {
      $localStorage.backand.hideJumbo = false;
    };

  }

  angular.module('common.services')
    .service('LayoutService',['$localStorage', LayoutService]);

})();

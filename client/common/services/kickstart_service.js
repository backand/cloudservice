(function () {
  'use strict';

  angular.module('common.services')
    .service('KickstartService', ['$http', 'CONSTS', KickstartService]);

  function KickstartService($http, CONSTS) {

    var self = this;

    self.getPlatformContent = function (platformName) {
      return "Hello!";
    };
  }

})();

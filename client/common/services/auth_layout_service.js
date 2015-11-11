(function() {
  'use strict';

  angular.module('common.services')
    .service('AuthLayoutService', AuthLayoutService);

  function AuthLayoutService() {

    var self = this;
    self.flags = {};

  }

})();

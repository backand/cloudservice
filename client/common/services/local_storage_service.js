(function () {
  'use strict';
  angular.module('common.services')
    .service('LocalStorageService', ['$localStorage', LocalStorageService]);
  function LocalStorageService($localStorage) {
    var self = this;

    self.getLocalStorage = function () {
      if (!$localStorage.backand) {
        $localStorage.backand = $localStorage.backand || {};
      }
      if (!$localStorage.backand[self.userId]) {
        $localStorage.backand[self.userId] = {};
      }
      return $localStorage.backand[self.userId];
    }
  }
}());

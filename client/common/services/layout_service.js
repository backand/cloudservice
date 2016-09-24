(function() {
  'use strict';

  angular.module('common.services')
    .service('LayoutService',['$localStorage', 'SessionService', LayoutService]);

  function LayoutService($localStorage, SessionService) {

    var self = this;
    self.userId = SessionService.getUserId();
    $localStorage.backand = $localStorage.backand || {};
    $localStorage.backand[self.userId] = $localStorage.backand[self.userId] || {};


    self.showJumbo = function () {
        $localStorage.backand = $localStorage.backand || {};
        if(!$localStorage.backand[self.userId] || !angular.isDefined($localStorage.backand[self.userId].hideJumbo)){
          $localStorage.backand[self.userId] = $localStorage.backand[self.userId] || {};
          self.openJumbo();
        }

      return !$localStorage.backand[self.userId].hideJumbo;

    };

    self.loadShowIntercomConfig = function () {
      if (window.intercomSettings) {
        var storage = getLocalStorage();
        window.intercomSettings.hide_default_launcher = storage.hideIntercom;
      }
    };

    self.toggleIntercomIconVisibility = function () {
      if (window.intercomSettings) {
        window.intercomSettings.hide_default_launcher = !window.intercomSettings.hide_default_launcher;
        var storage = getLocalStorage();
        storage.hideIntercom = window.intercomSettings.hide_default_launcher;
        return !window.intercomSettings.hide_default_launcher;
      }
      return false;
    };

    self.closeJumbo = function () {
      $localStorage.backand[self.userId].hideJumbo = true;
    };

    self.openJumbo = function () {
      $localStorage.backand[self.userId].hideJumbo = false;
    };

    function getLocalStorage() {
      if (!$localStorage.backand) {
        $localStorage.backand = $localStorage.backand || {};
      }
      if (!$localStorage.backand[userId]) {
        $localStorage.backand[userId] = {};
      }
      return $localStorage.backand[userId];
    }

  }

})();

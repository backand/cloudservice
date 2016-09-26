(function () {
  'use strict';

  angular.module('common.services')
    .service('LayoutService', ['$localStorage', 'SessionService', LayoutService]);

  function LayoutService($localStorage, SessionService) {

    var self = this;
    self.userId = SessionService.getUserId();
    $localStorage.backand = $localStorage.backand || {};
    $localStorage.backand[self.userId] = $localStorage.backand[self.userId] || {};


    self.showJumbo = function () {
      $localStorage.backand = $localStorage.backand || {};
      if (!$localStorage.backand[self.userId] || !angular.isDefined($localStorage.backand[self.userId].hideJumbo)) {
        $localStorage.backand[self.userId] = $localStorage.backand[self.userId] || {};
        self.openJumbo();
      }

      return !$localStorage.backand[self.userId].hideJumbo;

    };

    self.loadShowIntercomConfig = function () {
      if (window.analytics) {
        var storage = getLocalStorage();
        if (storage.hideIntercom) {
          hideIntercom();
        } else {
          showIntercom();
        }
        return !storage.hideIntercom;
      }
    };

    self.toggleIntercomIconVisibility = function () {
      if (window.analytics) {
        var storage = getLocalStorage();
        storage.hideIntercom = !storage.hideIntercom;
        if (storage.hideIntercom) {
          hideIntercom();
          return false;
        }
        showIntercom();
        return true;
      }
      return true;
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
      if (!$localStorage.backand[self.userId]) {
        $localStorage.backand[self.userId] = {};
      }
      return $localStorage.backand[self.userId];
    }

    function toggleIntercom(hide) {
      analytics.identify('', {}, {
        Intercom: {hideDefaultLauncher: hide}
      });
    }

    function showIntercom() {
      toggleIntercom(false);
    }

    function hideIntercom() {
      toggleIntercom(true);
    }

  }

})();

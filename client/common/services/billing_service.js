(function() {
  'use strict';

  function BillingService($http, CONSTS, AppsService, SessionService) {

    var self = this;

    self.getPortalUrl = function () {
      return CONSTS.billingUrl + "/index.php?force=true&auth_app=" + AppsService.currentApp.Name + "&auth_id=" + SessionService.getToken();
    };

    self.getPortalPlansUrl = function () {
      return CONSTS.billingUrl + "/editSubscription.php?force=true&auth_app=" + AppsService.currentApp.Name + "&auth_id=" + SessionService.getToken();
    };

    self.getPortalPaymentUrl = function () {
      return CONSTS.billingUrl + "/editCard.php?force=true&auth_app=" + AppsService.currentApp.Name + "&auth_id=" + SessionService.getToken();
    };

  }

  angular.module('common.services')
    .service('BillingService', ['$http','CONSTS','AppsService','SessionService', BillingService]);
})();

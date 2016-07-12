(function() {
  'use strict';

  function BillingService($http, $q, CONSTS, AppsService, SessionService) {

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

    self.getGlobalPaymentUrl = function (appName) {
      return CONSTS.billingUrl + "/editCard.php?force=true&loc=2&auth_app=" + appName + "&auth_id=" + SessionService.getToken();
    };

    self.getAppWithSubscription = function(){

      //need to loop on the apps of the user and get at least 1 app with subscription

      var defer = $q.defer();

      var loop = function (i) {

        var exit = (i === AppsService.apps.list.length);
        // Example of a promise to wait for
        checkAppInBilling(i).then(function (data) {
          defer.resolve(data);
          exit = true;
        }).finally(function () {
          // Resolve or continue with loop
          if (exit) {
            defer.resolve(null);
            return;
          } else {
            loop(++i);
          }
        });
      };

      loop(0); // Start loop
      return defer.promise;

    };

    function checkAppInBilling(i){

      var appName = AppsService.apps.list[i].Name;
      return $http({
        method: 'POST',
        headers: {'AppName': appName},
        config: {ignoreError: true},
        url: CONSTS.appUrl + '/1/general/billingSubscriptionId'
      });
    }

  }

  angular.module('common.services')
    .service('BillingService', ['$http','$q','CONSTS','AppsService','SessionService', BillingService]);
})();

(function  () {
  'use strict';
  angular.module('backand')
    .controller('BillingPortalController', ['$sce','BillingService','$scope','$state','$injector','$modal', BillingPortalController]);

  function BillingPortalController($sce, BillingService, $scope, $state, $injector, $modal){
    var self = this;
    var height = "1778";

    self.title = "Billing Portal";
    self.subTitle = "";
    self.titleStyle = "";

    if($state.is('app.billingupgrade')){
      setUrlPrefix(BillingService.getPortalPlansUrl(),height);

    }
    else if ($state.is('app.billingpayment')) {
      setUrlPrefix(BillingService.getPortalPaymentUrl(),height);

    } else if($state.current.name == "apps.index") {

      if($modal.appName) {
      //need to find first an app for the payment
      self.titleStyle = "color:red;";
      self.title = "The " + $modal.appName + " Application is Locked!";
      self.subTitle = "Due to unsettled invoice this application has been locked! Please provide a valid credit card" +
          " to allow the application to continue to operate. If no valid credit card will be provided soon this" +
          " application will be automatically deleted.";
      } else {
        self.title = "Update Payment Method";
      }

      BillingService.getAppWithSubscription().then(function (data) {
        setUrlPrefix(BillingService.getGlobalPaymentUrl(data.data.appName),"778");
      })
    }
    else {
      setUrlPrefix(BillingService.getPortalUrl(),height);
    }

    function setUrlPrefix(url, height) {
      self.urlPrefix = $sce.trustAsHtml('<iframe id="billIframe" src="'
          + url + '"  style="height:' + height + 'px;width:100%;border:none"' +
          '></iframe>');
    }

    $scope.$on('$destroy', function () {
      //window.removeEventListener('message', eventListener, false);
      // clear the iframe
      var iframe = angular.element('#billIframe');
      if (iframe && iframe.length > 0) {
        iframe[0].src = "javascript:void(0);";
      }

    });

    // window.addEventListener('message', eventListener, false);
    //
    // function eventListener(e){
    //   var eventName = e.data[0];
    //   var data = e.data[1];
    //   switch (eventName) {
    //     case 'setHeight':
    //       $("#restIframe").height(data + 50);
    //       break;
    //     case 'ready':
    //       var o = document.getElementsByTagName('iframe')[0];
    //       //usSpinnerService.spin("loading");
    //
    //       // var message = {auth: 'bearer ' + token, appName: appName};
    //       // o.contentWindow.postMessage(message, "*");
    //       break;
    //     case 'onSuccess':
    //       //usSpinnerService.stop("loading");
    //       break;
    //   }
    // }

    self.cancelDialog = function () {
      $modalInstance.dismiss('cancel');
    }

  }
}());

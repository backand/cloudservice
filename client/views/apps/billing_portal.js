(function  () {
  'use strict';
  angular.module('backand')
    .controller('BillingPortalController', ['$sce','BillingService','$scope','$state', BillingPortalController]);

  function BillingPortalController($sce, BillingService, $scope, $state){
    var self = this;

    var url = "";
    if($state.is('app.billingupgrade')){
      url = BillingService.getPortalPlansUrl();
    }
    else if ($state.is('app.billingpayment')) {
      url = BillingService.getPortalPaymentUrl();
    }
    else {
      url = BillingService.getPortalUrl();
    }

    self.urlPrefix = $sce.trustAsHtml('<iframe id="billIframe" src="'
         + url + '"  style="height:1778px;width:100%;border:none"' +
        '></iframe>');

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

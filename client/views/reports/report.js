(function  () {
  'use strict';
  angular.module('backand')
    .controller('ReportController', ['$sce','ReportService','$scope', ReportController]);

  function ReportController($sce, ReportService, $scope){
    var self = this;
    var height = "778";

    self.dateParams = [
      {value : "today", label:"Today"},
      {value : "yesterday", label:"Yesterday"},
      {value : "last7days", label:"Last 7 Days"}
    ];
    self.dateParam = "";
    self.startDate = new Date();
    self.altInputFormats = ['M!/d!/yyyy'];

    self.dateOptions = {
      formatYear: 'yy',
      minDate: new Date(2016, 6, 1),
      maxDate: new Date(),
      startingDay: 1
    };

    // ReportService.getReportlUrl('daily_active_identified_users').then(function (data) {
    //   setUrlPrefix(data.data.url, height);
    // });

    function setUrlPrefix(url, height) {
      self.urlPrefix = $sce.trustAsHtml('<iframe id="billIframe" src="'
          + url + '"  style="height:' + height + 'px;width:100%;border:none"' +
          '></iframe>');
    }

    $scope.$on('$destroy', function () {
      //window.removeEventListener('message', eventListener, false);
      // clear the iframe
      var iframe = angular.element('#reportframe');
      if (iframe && iframe.length > 0) {
        iframe[0].src = "javascript:void(0);";
      }

    });

    self.openDateStart = function() {
      self.opened = true;
    };

    self.onDateParamChanged = function(){

    };

    self.cancelDialog = function () {
      $modalInstance.dismiss('cancel');
    };

  }
}());

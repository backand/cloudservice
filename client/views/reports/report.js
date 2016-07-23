(function () {
  'use strict';
  angular.module('backand')
    .controller('ReportController', ['$sce', 'ReportService', '$scope', ReportController]);

  function ReportController($sce, ReportService, $scope) {
    var self = this;
    var height = "778";

    self.dateParams = [
      {value: "today", label: "Today", action: setTodayDates},
      {value: "yesterday", label: "Yesterday", action: setYesterdayDates},
      {value: "last7days", label: "Last 7 Days", action: setLastSevenDaysDate},
      {value: "custom", label: "Custom..."}
    ];
    self.todaysDate = new Date();

    self.dateParam = "last7days";
    setLastSevenDaysDate();
    setReportUrl();


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

    self.runReport = function(){
      setReportUrl();
    };

    function setReportUrl(){
      ReportService.getReportlUrl('daily_active_identified_users', self.startDate, self.endDate).then(function (data) {
        setUrlPrefix(data.data.url, height);
      });
    }


    // Set the dates according to the selected option
    self.onDateParamChanged = function () {
      var chosenDateParam = _.where(self.dateParams, {value: self.dateParam})[0];
      if (chosenDateParam.action) {
        chosenDateParam.action()
      }
    };

    function setTodayDates() {
      self.startDate = new Date();
      self.endDate = self.startDate;
    }

    function setYesterdayDates() {
      self.endDate = new Date();
      self.startDate = new Date();
      self.startDate.setDate(self.endDate.getDate() - 1);
    }

    function setLastSevenDaysDate() {
      self.endDate = new Date();
      self.startDate = new Date();
      self.startDate.setDate(self.endDate.getDate() - 7);
    }

  }
}());

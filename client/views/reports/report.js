(function () {
  'use strict';
  angular.module('backand')
    .controller('ReportController', ['$sce', 'ReportService', '$scope', ReportController]);

  function ReportController($sce, ReportService, $scope) {
    var self = this;
    var height = "678";

    self.reports = [
      {name: "daily_active_identified_users", label: "Daily Active Identified Users"},
      {name: "daily_active_devices", label: "Daily Active Devices"},
      {name: "backand_compute", label: "Backand Compute"},
      {name: "cache_memory", label: "Cache Memory"}
    ];

    self.dateParams = [
      {value: "today", label: "Today", action: setTodayDates},
      {value: "yesterday", label: "Yesterday", action: setYesterdayDates},
      {value: "last7days", label: "Last 7 Days", action: setLastSevenDaysDate},
      {value: "custom", label: "Custom..."}
    ];

    self.report = "";
    self.todaysDate = today();

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
    
    self.onReportChanged = function(){
      setReportUrl();
    };

    self.runReport = function(){
      setReportUrl();
    };

    function setReportUrl(){
      if(self.report != "") {
        ReportService.getReportlUrl(self.report, self.startDate, self.endDate).then(function (data) {
          setUrlPrefix(data.data.url, height);
        });
      }
    }


    // Set the dates according to the selected option
    self.onDateParamChanged = function () {
      var chosenDateParam = _.where(self.dateParams, {value: self.dateParam})[0];
      if (chosenDateParam.action) {
        chosenDateParam.action()
      }
    };

    function today(){
      return new Date(new Date().setUTCHours(0,0,0,0));
    }

    function setTodayDates() {
      self.startDate = today();
      self.endDate = self.startDate;
    }

    function setYesterdayDates() {
      self.startDate = today();
      self.startDate.setDate(today().getUTCDate() - 1);
      self.endDate = today();
    }

    function setLastSevenDaysDate() {
      self.startDate = today();
      self.startDate.setDate(self.startDate.getUTCDate() - 7);
      self.endDate = today();
      self.endDate.setDate(self.endDate.getUTCDate() - 1);

    }

  }
}());

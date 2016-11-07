(function () {
  'use strict';
  angular.module('backand')
    .controller('ReportController', ['$sce', 'ReportService', '$scope', '$state', '$filter', ReportController]);

  function ReportController($sce, ReportService, $scope, $state, $filter) {
    var self = this;
    var height = "678";

    self.reports = [
      {name: "devices_by_country", label: "Devices by Country", group:"- Activity"},
      {name: "daily_active_devices", label: "Daily Active Devices", group:"- Activity"},
      {name: "weekly_active_devices", label: "Weekly Active Devices", group:"- Activity"},
      {name: "monthly_active_devices", label: "Monthly Active Devices", group:"- Activity"},
      {name: "users_by_country", label: "Registered Users by Country", group:"- Activity"},
      {name: "daily_active_identified_users", label: "Daily Active Registered Users", group:"- Activity"},
      {name: "weekly_active_identified_users", label: "Weekly Active Registered Users", group:"- Activity"},
      {name: "monthly_active_identified_users", label: "Monthly Active Registered Users", group:"- Activity"},
      {name: "most_active_users", label: "Top Active Registered Users", group:"- Activity"},
      {name: "requests_per_objects", label: "Requests per Objects", group:"- Performance"},
      {name: "slow_requests", label: "Slow Requests", group:"- Performance"},
      {name: "backand_compute", label: "Backand Compute", group:"- Usage"},
      {name: "cache_memory", label: "Cache Memory", group:"- Usage"},
      {name: "requests_per_second", label: "Requests Per Second", group:"- Usage"},
      {name: "data_hosting", label: "Data Hosting", group:"- Usage"},
      {name: "database_size", label: "Database Size", group:"- Usage"}
    ];

    self.dateParams = [
      {value: "today", label: "Today", action: setTodayDates, days: 0},
      {value: "yesterday", label: "Yesterday", action: setLastDates, days: 1},
      {value: "last7days", label: "Last 7 Days", action: setLastDates, days: 7},
      {value: "last30days", label: "Last 30 Days", action: setLastDates, days: 30},
      {value: "last90days", label: "Last 90 Days", action: setLastDates, days: 90},
      {value: "currentweek", label: "Current Week", action: setCurrentWeek},
      {value: "currentmonth", label: "Current Month", action: setCurrentMonth},
      {value: "custom", label: "Custom..."}
    ];

    if($state.params.id != undefined){
      self.report = $state.params.id;
    } else {
      self.report = "devices_by_country";
    }

    self.todaysDate = today();

    self.dateParam = "last7days";
    setLastDates(7);
    setReportUrl();


    function setUrlPrefix(url, height) {
      self.urlPrefix = $sce.trustAsHtml('<iframe id="reportIframe" src="'
      + url + '"  style="height:' + height + 'px;width:100%;border:none"' +
      '></iframe>');
    }

    $scope.$on('$destroy', function () {
      //window.removeEventListener('message', eventListener, false);
      // clear the iframe
      var iframe = angular.element('#reportIframe');
      if (iframe && iframe.length > 0) {
        iframe[0].src = "javascript:void(0);";
      }

    });

    $scope.$watch(function () {
      return self.endDate;
    }, formatDate);

    $scope.$watch(function () {
      return self.startDate;
    }, formatDate);

    self.onReportChanged = function(){
      setReportUrl();
    };

    self.runReport = function(){
      setReportUrl();
    };

    function setReportUrl(){
      if(self.report != "") {
        $state.go('analytics.report', {id: self.report}, {notify: false});

        ReportService.getReportUrl(self.report, returnDateOnly(formatDate(self.startDate)),
          returnDateOnly(formatDate(self.endDate))).then(function (data) {
          setUrlPrefix(data.data.url, height);
        });
      }
    }

    function returnDateOnly(date){
      return date.toLocaleString('en-US').split(',')[0];
    }


    // Set the dates according to the selected option
    self.onDateParamChanged = function () {
      var chosenDateParam = _.where(self.dateParams, {value: self.dateParam})[0];
      if (chosenDateParam.action) {
        chosenDateParam.action(chosenDateParam.days)
      }
    };

    function today(){
      return new Date(new Date().setHours(0,0,0,0));
    }

    function setTodayDates() {
      self.startDate = today();
      self.endDate = self.startDate;
    }

    function setLastDates(days) {
      self.startDate = today();
      self.startDate.setDate(self.startDate.getDate() - days);
      self.endDate = today();
      self.endDate.setDate(self.endDate.getDate() - 1);
    }

    function setCurrentWeek(){
      var day = today().getDay();
      setLastDates(day);
    }

    function setCurrentMonth(){
      var day = today().getDate();
      setLastDates(day-1);
    }

    function formatDate(date) {
      return $filter('date')(date, 'yyyy-MM-dd');
    }

  }
}());

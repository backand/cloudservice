(function() {
  'use strict';

  function ReportService($http, CONSTS, AppsService) {

    var self = this;

    self.getReportUrl = function (reportName, startDate, endDate) {
      var appName = AppsService.currentApp.Name;
      return $http({
        method: 'POST',
        headers: {'AppName': appName},
        url: CONSTS.appUrl + '/1/general/getReportURL',
        params:{
          report: reportName,
          startDate: onlyDate(startDate),
          endDate: onlyDate(endDate)
        }
      });
    };

    function onlyDate(date){
      return date;
    }

  }

  angular.module('common.services')
    .service('ReportService', ['$http','CONSTS','AppsService', ReportService]);
})();

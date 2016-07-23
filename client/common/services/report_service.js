(function() {
  'use strict';

  function ReportService($http, CONSTS, AppsService) {

    var self = this;

    self.getReportlUrl = function (reportName, startDate, endDate) {
      var appName = AppsService.currentApp.Name;
      return $http({
        method: 'POST',
        headers: {'AppName': appName},
        url: CONSTS.appUrl + '/1/general/getReportURL',
        params:{
          report: reportName,
          startDate: startDate,
          endDate: endDate
        }
      });
    };
    

  }

  angular.module('common.services')
    .service('ReportService', ['$http','CONSTS','AppsService', ReportService]);
})();

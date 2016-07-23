(function() {
  'use strict';

  angular.module('backand')
      .config(config);

  function config($stateProvider) {
    $stateProvider
        .state('report.portal', {
          url: '/report',
          controller: 'ReportController as vm',
          templateUrl: 'views/reports/report.html'
        })
  }

})();

(function () {
  'use strict';

  angular.module('backand.cronJobs', [])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('cronJobs.new', {
        url: '/new',
        controller: 'CronJobsController as cronJobs',
        templateUrl: 'views/cron_jobs/job.html'
      })
      .state('cronJobs.job', {
        url: '/:jobId',
        controller: 'CronJobsController as cronJobs',
        templateUrl: 'views/cron_jobs/job.html'
      })
      .state('cronJobs.newSavedJob', {
        url: '/new/:jobId',
        controller: 'CronJobsController as cronJobs',
        templateUrl: 'views/cron_jobs/job.html'
      });

  }

})();

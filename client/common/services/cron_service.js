(function () {
  angular.module('common.services')
    .service('CronService', ['$http', 'CONSTS', CronService]);

  function CronService($http, CONSTS) {
    var self = this;
    self.appName = null;
    var CRON_URL = '/1/jobs/';

    self.get = function (id) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + CRON_URL + id,
        headers: {AppName: self.appName}
      });
    };

    self.getAll = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + CRON_URL,
        headers: {AppName: self.appName}
      });
    };

    self.post = function (job) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + CRON_URL,
        headers: {AppName: self.appName},
        data: job
      });
    };

    self.update = function (id, job) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + CRON_URL + id,
        headers: {AppName: self.appName},
        data: job
      });
    };

    self.delete = function (id) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + CRON_URL + id,
        headers: {AppName: self.appName}
      });
    };

    self.test = function (id) {
      return $http(self.getTestHttp(id));
    };

    self.getTestUrl = function (id) {
      return CONSTS.appUrl + CRON_URL + 'run/' + id + "/test";
    };

    self.getTestHttp = function (id) {
      return {
        method: 'GET',
        url: self.getTestUrl(id),
        headers: {AppName: self.appName},
        config: {ignoreError: true}
      };
    };


  }
})();

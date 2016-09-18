(function () {
  angular.module('common.services')
    .service('CronService', ['$http', 'CONSTS', CronService]);

  function CronService($http, CONSTS) {
    var self = this;
    self.appName = null;

    self.get = function (id) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/cron/' + id,
        headers: {AppName: self.appName}
      });
    };

    self.getAll = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/cron',
        headers: {AppName: self.appName}
      });
    };

    self.post = function (job) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/cron',
        headers: {AppName: self.appName},
        data: job
      });
    };

    self.update = function (id, job) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/cron/' + id,
        headers: {AppName: self.appName},
        data: job
      });
    };

    self.delete = function (id) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/cron/' + id,
        headers: {AppName: self.appName}
      });
    };

    self.test = function (id) {
      return $http(self.getTestHttp(id));
    };

    self.getTestUrl = function (id) {
      return CONSTS.appUrl + '/1/cron/run/' + id + "/test";
    };

    self.getTestHttp = function (id) {
      return {
        method: 'GET',
        url: self.getTestUrl(id),
        headers: {AppName: self.appName}
      };
    };


  }
})();

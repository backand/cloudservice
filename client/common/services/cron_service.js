(function () {
  angular.module('common.services')
    .service('CronService', ['$http', 'CONSTS', CronService]);

  function CronService($http, CONSTS) {
    var self = this;

    self.get = function (id) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/cron/' + id
      });
    };

    self.getAll = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/cron'
      });
    };

    self.post = function (job) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/cron'
      });
    };

    self.update = function (id, job) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/cron/' + id
      });
    };

    self.delete = function (id) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/cron/' + id
      });
    };
  }
})();

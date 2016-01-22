(function () {

  angular.module('common.services')
    .service('HostingService', ['CONSTS', '$http', HostingService]);

  function HostingService(CONSTS, $http) {
    var self = this;

    self.get = function (appName, path) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/hosting/folder',
        headers: {AppName: appName},
        params: {
          path: path
        }
      });
    };
  }

}());

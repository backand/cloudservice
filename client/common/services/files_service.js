(function () {

  angular.module('common.services')
    .service('FilesService', ['CONSTS', '$http', FilesService]);

  function FilesService(CONSTS, $http) {
    var self = this;

    self.get = function (appName, path) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/files/folder',
        headers: {AppName: appName},
        params: {
          path: path
        }
      });
    };
  }

}());

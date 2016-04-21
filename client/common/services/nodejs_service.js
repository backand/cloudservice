(function () {

  angular.module('common.services')
    .service('NodejsService', ['CONSTS', '$http', NodejsService]);

  function NodejsService(CONSTS, $http) {
    var self = this;

    self.objectName = null;
    self.actionName = null;

    self.get = function (appName, path) {
        return $http({
          method: 'GET',
          url: CONSTS.appUrl + '/1/nodejs/folder',
          headers: {AppName: appName},
          params: {
            path: path,
            objectName: self.objectName,
            actionName: self.actionName
          }
        });
    };
  }

}());

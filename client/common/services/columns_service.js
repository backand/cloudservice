(function() {

  function ColumnsService($http, CONSTS, $log) {

    var self = this;

    self.appName = null;
    self.tableName = null;

    this.sync = function() {
        return $http({
            method: 'GET',
            url: CONSTS.appUrl + '/1/app/sync',
            headers: { AppName: self.appName }
        });
    };

    this.get = function() {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/config/' + self.tableName,
        headers: { AppName: self.appName }
      });
    };
  }

  angular.module('common.services')
    .service('ColumnsService', ['$http', 'CONSTS', '$log', ColumnsService]);
})();

(function() {

  function ColumnsService($http, CONSTS, $q) {

    var self = this;

    self.appName = null;
    self.tableName = null;
    self._tableConfig = null;
    self._preTableName = null;

    this.sync = function() {
        return $http({
            method: 'GET',
            url: CONSTS.appUrl + '/1/app/sync',
            headers: { AppName: self.appName }
        });
    };

    this.get = function (force) {
      var deferred = $q.defer();
      if (self._tableConfig == null || self._preTableName == null || self._preTableName != self.tableName) {
        self._get()
          .success(function (data) {
            self._tableConfig = data;
            self._preTableName = self.tableName;
            deferred.resolve(self._tableConfig);
          })
          .error(function (err) {
            self._tableConfig = null;
            deferred.reject(err);
          });

        return deferred.promise;
      }
      else
      {
        deferred.resolve(self._tableConfig);
        return deferred.promise;
      }
    };

    this._get = function() {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/config/' + self.tableName,
        headers: { AppName: self.appName }
      });
    };

    this.getData = function(size, page, sort){
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/' + self.tableName,
        headers: {
          'AppName': self.appName
        },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : '',
          'sort' : sort
        }
      });
    };

  }

  angular.module('common.services')
    .service('ColumnsService', ['$http', 'CONSTS', '$q', ColumnsService]);
})();

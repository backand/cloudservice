(function() {

  function ColumnsService($http, CONSTS, $q, NotificationService, $interval) {

    var self = this;
    self.commit=_update;
    var _tableConfig = null;
    var _preTableName = null;
    var stop;

    self.appName = null;
    self.tableName = null;

    self.sync = function() {
        return $http({
            method: 'GET',
            url: CONSTS.appUrl + '/1/app/sync',
            headers: { AppName: self.appName }
        });
    };

    self.get = function () {
      var deferred = $q.defer();
      if (_tableConfig == null || _preTableName == null || _preTableName != self.tableName) {
          _get()
          .success(function (data) {
            _tableConfig = data;
            _preTableName = self.tableName;
            deferred.resolve(_tableConfig);
          })
          .error(function (err) {
            _tableConfig = null;
            deferred.reject(err);
          });

        return deferred.promise;
      }
      else
      {
        deferred.resolve(_tableConfig);
        return deferred.promise;
      }
    };

    function _get() {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/config/' + self.tableName,
        headers: { AppName: self.appName }
      });
    }

    self.getData = function(size, page, sort){
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

    //Keep hash with the objects to save.
    //Run interval every x seconds to save the objects that are in the cache.
    //After save remove from hash

    var _hashCommit = [];
    var saveData = false;

    self.update = function (table) {
      //_hashCommit.push(table);
      return _update(table).then(function (data){
        NotificationService.add('success', 'Data saved');
        return data;
      });
    };

    function _update (table) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/table/config/' + table.name,
        headers: { AppName: self.appName },
        data: table
      });
    };

    stop = $interval(function () {
      //don't get into the loop while saving = semafore
      if (saveData)
        return;

      saveData = true;

      angular.forEach(_hashCommit, function (table1) {
        _update(table1).then(function (data) {
          _hashCommit.splice(_hashCommit.indexOf(table1), 1);
          if(_hashCommit.length == 0)
          {
            saveData = false;
            NotificationService.add('success', 'Data saved');
          }
        });
      });
      if(_hashCommit.length == 0)
        saveData = false;

    }, 10000);

    function stopRefresh() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    //$scope.$on('$destroy', function() {
    //  stopRefresh();
    //});

  }

  angular.module('common.services')
    .service('ColumnsService', ['$http', 'CONSTS', '$q','NotificationService','$interval', ColumnsService]);
})();

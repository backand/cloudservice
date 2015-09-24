(function() {

  function ColumnsService($http, CONSTS, $q, NotificationService, $interval, $rootScope, AppsService) {

    var self = this;
    var _tableConfig = null;
    var _preTableName = null;
    var stop;

    self.commit = update;
    self.forceCommit = _update;
    self.tableName = null;

    self.sync = function() {
        return $http({
            method: 'GET',
            url: CONSTS.appUrl + '/1/app/sync',
            headers: { 'AppName': AppsService.currentApp.Name }
        });
    };

    self.get = function (force) {
      var deferred = $q.defer();
      if (force || _tableConfig == null || _preTableName == null || _preTableName != self.tableName) {
        _get()
          .success(function (data) {
            _tableConfig = data;
            _preTableName = self.tableName;
            _tableConfig.__metadata.name = data.name;
            deferred.resolve(_tableConfig);
          })
          .error(function (err) {
            _tableConfig = null;
            deferred.reject(err);
          });

      } else {
        deferred.resolve(_tableConfig);
      }

      return deferred.promise;
    };

    self.getColumns = function (tableName) {
      return _get(tableName);
    };

    function _get(tableName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/config/' + (_.isEmpty(tableName) ? self.tableName : tableName),
        headers: { 'AppName': AppsService.currentApp.Name }
      });
    }

    //Keep hash with the objects to save.
    //Run interval every x seconds to save the objects that are in the cache.
    //After save remove from hash

    var _hashCommit = {};
    var saveData = false;

    function update (table) {
      _hashCommit[table.__metadata.name] = angular.copy(table);
      //return _update(table).then(function (data){
      //  NotificationService.add('success', 'Data saved');
      //  return data;
      //});
    }

    function _update (table) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/table/config/' + table.__metadata.name,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: table
      });
    }

    stop = $interval(function () {
      //don't get into the loop while saving = semaphore
      if (saveData)
        return;

      if(JSON.stringify(_hashCommit) == "{}"){
        saveData = false;
        return;
      }
      saveData = true;

      //must work on local copy of the hash
      var localHash = angular.copy(_hashCommit);
      _hashCommit = {}; //clear after copy

      angular.forEach(localHash, function (table1) {
        _update(table1).then(function (data) {
          delete localHash[table1.__metadata.name];
          if(JSON.stringify(localHash) == "{}") //empty object
          {
            saveData = false;
            NotificationService.add('success', 'Data saved');
            //only when app name change
            if(table1.__metadata.name != table1.name)
              $rootScope.$broadcast('appname:saved');
          }
        }, function (error){
          saveData = false;
          delete localHash[table1.__metadata.name]; // clear the hash
        });
      });

    }, 1000);

    function stopRefresh() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    $rootScope.$on('$destroy', function() {
      stopRefresh();
    });

  }

  angular.module('common.services')
    .service('ColumnsService', ['$http', 'CONSTS', '$q', 'NotificationService', '$interval', '$rootScope', 'AppsService', ColumnsService]);
})();

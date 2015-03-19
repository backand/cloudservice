(function () {
  'use strict';

  function appsService($http, $q, CONSTS, DatabaseNamesService, NotificationService) {

    var self = this;

    var apps = {
      list: [],
      names: [],
      status: {},
      alerts: {},
      loaded: false
    };

    var currentApp;

    apps.deferred = $q.defer();

    function updateAppNames() {
      apps.names = [];
      apps.list.forEach(function (item) {
        apps.names.push(item.Name);
        apps.status[item.Name] = item.DatabaseStatus;
      })
    }

    self.setCurrentApp = function (data) {
      currentApp = data;
      currentApp.databaseName = data.Database_Source ? DatabaseNamesService.getDBSource(data.Database_Connection.Database_Source) : undefined;
    };

    self.getCurrentApp = function (appName) {
      var deferred = $q.defer();
      self.find(appName)
        .success(function (data) {
          self.setCurrentApp(data);
          currentApp.myStatus = {status: data.DatabaseStatus, oldStatus: apps.status[appName]};
          deferred.resolve(currentApp);
        })
        .error(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;

    };

    self.getAlert = function (appName) {
      if (apps.alerts[appName] == null) {
        this.appDbStat(appName)
          .success(function (data) {
            if (data.tableCount == 0)
              apps.alerts[appName] = "Your database has no tables! Go to <a href=''>Database Create</a> to load a template, or use an administrative tool to create some tables";
            return apps.alerts[appName];
          })
      }

      return apps.alerts[appName];

    };

    self.setAlert = function (appName, msg) {
      apps.alerts[appName] = msg;
    };

    function searchStringInArray(str, strArray) {
      for (var j = 0; j < strArray.length; j++) {
        if (strArray[j].match(str)) return j;
      }
      return -1;
    }

    self.appNames = function (appName) {
      if (searchStringInArray(appName, apps.names) === -1) {
        apps.names.push(appName);
      }
      return apps.names;
    };

    self.getApps = function () {
      var deferred = $q.defer();
      if(apps.loaded)
        deferred.resolve(apps)
      else
        self.all().then(function(){
          deferred.resolve(apps);
        });

      return deferred.promise;
    }

    self.all = function () {
      var deferred = $q.defer();
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps?pageSize=50'
      })
        .success(function (data) {
          apps.list = data.data;
          updateAppNames();
          apps.loaded = true;
          deferred.resolve(data);
        })
        .error(function (error) {
          apps.loaded = false;
          deferred.reject(error);
        });

      return deferred.promise;
    };

    self.refresh = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps?pageSize=50'
      });

    };
    self.find = function (appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/' + appName + '?deep=true'
      });
    };

    self.add = function (name, title) {
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myApps/',
        data: {
          Name: name,
          Title: title
        }
      })
      .success(function (data) {
        deferred.resolve(data.data);
      })
      .error(function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    self.appDbStat = function (appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/app/dbStat',
        headers: {AppName: appName}
      });
    };

    self.appKeys = function (appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myAppKeys/' + appName,
      });
    };

    self.update = function (name, data) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/' + name,
        data: data
      });
    };

    self.delete = function (name) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/admin/myApps/' + name
      });
    };
  }

  angular.module('common.services')
    .service('AppsService', ['$http', '$q', 'CONSTS', 'DatabaseNamesService', 'NotificationService', appsService]);

})();

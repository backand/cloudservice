(function () {
  'use strict';

  angular.module('common.services')
    .service('AppsService', ['$http', '$q', 'CONSTS', 'DatabaseNamesService', '$interval', '$rootScope', 'SessionService', AppsService]);

  function AppsService($http, $q, CONSTS, DatabaseNamesService, $interval, $rootScope, SessionService) {

    var self = this;

    // Apps List

    var apps = {
      list: [],
      alerts: {},
    };

    self.apps = apps;

    self.all = function () {
      var deferred = $q.defer();
      getAllApps()
        .success(function (data) {
          angular.copy(data.data, apps.list);
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    self.add = function (name, title) {
      var deferred = $q.defer();
      addNewApp(name, title)
        .success(function (data) {
          self.all()
            .then(function () {
              deferred.resolve(data.data);
            })
        })
        .error(function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    // App

    self.currentApp = {};

    self.resetCurrentApp = function () {
      angular.copy({}, self.currentApp);
    };

      self.isExampleApp = function (app) {
      if (!app || !app.Name) return false;
      return app.Name === 'todo' + SessionService.getUserId();
      //return (app.Name.substring(0, 4) === 'todo')
    };

    self.getApp = function (appName) {
      var deferred = $q.defer();
      getApp(appName)
        .success(function (data) {
          setCurrentApp(data);
          deferred.resolve(self.currentApp);
        })
        .error(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    function setCurrentApp (data) {
      angular.copy(data, self.currentApp);
      self.currentApp.databaseName =
        data.Database_Source ? DatabaseNamesService.getDBSource(data.Database_Connection.Database_Source) : undefined;
      stopRefreshDBStatus();

      if (self.currentApp.DatabaseStatus == 2)
        startRefreshDBStatus();
    }

    var refreshDBStatus;
    function startRefreshDBStatus() {
      refreshDBStatus = $interval(getAppStatus, 3000);
    }

    function getAppStatus() {
      if (_.isEmpty(self.currentApp)) {
        stopRefreshDBStatus();
        return;
      }
      getApp(self.currentApp.Name)
        .success(function (result) {
          if (result && result.DatabaseStatus != 2) {
            setCurrentApp(result);
            $rootScope.$broadcast('AppDbReady', result.Name);
          }
        });
    }

    function stopRefreshDBStatus() {
      if (angular.isDefined(refreshDBStatus)) {
        $interval.cancel(refreshDBStatus);
        refreshDBStatus = undefined;
      }
    }

    self.update = function (name, data) {
      return updateApp(name, data)
        .then(function () {
          self.getApp(data.Name || name)
        });
    };

    self.setAlert = function (appName, msg) {
      apps.alerts[appName] = msg;
    };

    self.delete = function (name) {
      return deleteApp(name)
        .then(function () {
          if (self.currentApp.Name === name)
            self.currentApp = null;
          self.all();
        })
    };


    // HTTP

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
        url: CONSTS.appUrl + '/admin/myAppKeys/' + appName
      });
    };

    function getAllApps () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps?pageSize=50'
      })
    }

    function addNewApp(name, title) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myApps/',
        data: {
          Name: name,
          Title: title
        }
      })
    }

    function getApp (appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/' + appName + '?deep=true'
      });
    }

    function updateApp (name, data) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/' + name,
        data: data
      });
    }

    function deleteApp (name) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/admin/myApps/' + name
      });
    }
  }

})();

(function () {
  'use strict';

  function AppsService($http, $q, CONSTS, DatabaseNamesService, $interval, $rootScope, AuthService) {

    var self = this;

    // Apps List

    var apps = {
      list: [],
      names: [],
      status: {},
      alerts: {},
      loaded: false
    };

    self.apps = apps;

    self.getAppsList = function () {
      return apps.names;
    };

    self.all = function () {
      var deferred = $q.defer();
      getAllApps()
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

    function updateAppNames() {
      apps.names = [];
      apps.list.forEach(function (item) {
        apps.names.push(item.Name);
        apps.status[item.Name] = item.DatabaseStatus;
      });
      apps.names.sort();
    }

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

    self.currentApp = null;

    self.isExampleApp = function (app) {
      if (!app || !app.Name) return false;
      return app.Name === 'todo' + AuthService.getUserId();
      //return (app.Name.substring(0, 4) === 'todo')
    };

    self.getAppStatus = function (appName) {
      return apps.status[appName];
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
      self.currentApp = data;
      self.currentApp.databaseName =
        data.Database_Source ? DatabaseNamesService.getDBSource(data.Database_Connection.Database_Source) : undefined;
      self.currentApp.myStatus = {status: data.DatabaseStatus, oldStatus: apps.status[self.currentApp.Name]};
      stopRefreshDBStatus();

      if (self.currentApp.DatabaseStatus == 2)
        startRefreshDBStatus();
    }

    var refreshDBStatus;
    function startRefreshDBStatus() {
      refreshDBStatus = $interval(getAppStatus, 3000);
    }

    function getAppStatus() {
      if (!self.currentApp)
        stopRefreshDBStatus();
      getApp(self.currentApp.Name)
        .success(function (result) {
          if (result && result.DatabaseStatus != 2) {
            stopRefreshDBStatus();
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
          self.getApp(data.Name)
        });
    };

    self.setAlert = function (appName, msg) {
      apps.alerts[appName] = msg;
    };

    self.delete = function (name) {
      deleteApp(name)
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

  angular.module('common.services')
    .service('AppsService', ['$http', '$q', 'CONSTS', 'DatabaseNamesService', '$interval', '$rootScope', 'AuthService', AppsService]);

})();

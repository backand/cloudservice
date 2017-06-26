(function () {
  'use strict';

  angular.module('common.services')
    .service('AppsService', ['$http', '$q', 'CONSTS', 'DatabaseNamesService', '$interval', '$rootScope', 'SessionService','AnalyticsService','DatabaseService','ModelService', AppsService]);

  function AppsService($http, $q, CONSTS, DatabaseNamesService, $interval, $rootScope, SessionService, AnalyticsService, DatabaseService, ModelService) {

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
              var resultSet = data.data || data;
              deferred.resolve(resultSet);
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

    self.getAppWithStat = function (appName) {
      var deferred = $q.defer();
      getAppWithStat(appName)
        .success(function (data) {
          setCurrentApp(data);
          deferred.resolve(self.currentApp);
        })
        .error(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    self.createNewAppLambdaLauncher = function (){
      var deferred = $q.defer();
      self.add()
        .then(function (data) {
          //get appName from response
          var appName = data.__metadata.appName;
          //track event that app is created
          AnalyticsService.track('CreatedApp', { appName: appName });
          //create App database with defaultSchema
          DatabaseService.createDB(appName, 10, '', ModelService.defaultSchema(),2)
            .success(function (data) {
              AnalyticsService.track('CreatedNewDB', { schema: ModelService.defaultSchema() });
              AnalyticsService.track('create app', { app: appName });
              self.resetCurrentApp();
              self.getApp(appName)
                .then(function () {
                  //make the app private
                  try{
                    var data = {};
                    angular.copy(self.currentApp, data);
                    data.settings.enableUserRegistration = false;

                    //disabled Twitter and adfs social
                    data.settings.enableTwitter = false;
                    data.settings.enableAdfs = false;
                    self.update(appName, data);

                  } catch(e){
                    console.log(e);
                    //ignore the error
                  }

                  var stateParams = { new: 1, appName: appName };
                  deferred.resolve(stateParams);
                });
            });
        });

      return deferred.promise;
    };

    function setCurrentApp(data) {
      angular.copy(data, self.currentApp);
      if (self.currentApp !== null) {
        self.currentApp.databaseName =
          data.Database_Source ? DatabaseNamesService.getDBSource(data.Database_Connection.Database_Source) : undefined;
        stopRefreshDBStatus();
      } else {
        return;
      }

      if (self.currentApp.DatabaseStatus == 2) {
        self.currentAppStatus = 2;
        startRefreshDBStatus();
      }
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
          if (result && result.DatabaseStatus != 2 && self.currentAppStatus === 2) {
            self.currentAppStatus = 1;
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

    self.reset = function (name) {
      return resetApp(name)
        .then(function () {
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

    self.resetAppKey = function (appName, key) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myAppKeys/reset/' + appName + '/' + key
      });
    };

    self.setDebug = function (mode) {
      return $http({
        method: 'PUT',
        headers: {'AppName': self.currentApp.Name},
        url: CONSTS.appUrl + '/1/debugMode?mode=' + mode
      });
    };

    self.getBackupVersions = function () {
      return $http({
        method: 'GET',
        headers: {'AppName': self.currentApp.Name},
        url: CONSTS.appUrl + '/1/app/versions'
      });
    };

    self.createBackup = function () {
      return $http({
        method: 'GET',
        headers: {'AppName': self.currentApp.Name},
        url: CONSTS.appUrl + '/1/app/sync'
      });
    };

    self.downloadBackup = function (version) {
      return $http({
        method: 'GET',
        headers: {'AppName': self.currentApp.Name},
        url: CONSTS.appUrl + '/1/app/download',
        responseType: 'arraybuffer',
        params: {version: version}
      });
    };

    self.uploadBackup = function (fileName, fileData) {
      return $http({
        method: 'POST',
        headers: {'AppName': self.currentApp.Name},
        url: CONSTS.appUrl + '/1/app/upload',
        data: {
          filename: fileName,
          filedata: fileData
        }
      });
    };

    self.restoreBackup = function (version) {
      return $http({
        method: 'GET',
        headers: {'AppName': self.currentApp.Name},
        url: CONSTS.appUrl + '/1/app/restore',
        params: {version: version}
      });
    };

    self.appCount = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps?pageSize=1'
      }).then(function(response){
        deferred.resolve(response.data.totalRows);
      });

      return deferred.promise;
    };

    function getAllApps () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps?pageSize=200'
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

    function getApp(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/' + appName //+ '?deep=true'
      });
    }

    function getAppWithStat(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/' + appName + '?deep=true' + '&stat=true'
      });
    }

    function updateApp(name, data) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/' + name,
        data: data
      });
    }

    function deleteApp(name) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/admin/myApps/' + name
      });
    }

    function resetApp(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/app/reload/',
        headers: {AppName: appName}
      });
    }
  }

})();

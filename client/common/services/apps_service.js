(function() {
  'use strict';

  function appsService($http, $q, CONSTS, DatabaseNamesService) {

    var self = this;

    var apps = {
      list: [],
      names: [],
      status: {},
      alerts: {}
    };

    var currentApp;

    apps.deferred = $q.defer();

    function updateAppNames() {
        apps.names = [];
        apps.list.forEach(function(item) {
        apps.names.push(item.Name);
        apps.status[item.Name] = item.DatabaseStatus;
      })
    }

    this.setCurrentApp = function(data){
      currentApp = data;
      currentApp.databaseName = data.Database_Source ? DatabaseNamesService.getDBSource(data.Database_Connection.Database_Source) : undefined;
    };

    this.getCurrentApp = function(appName){
      var deferred = $q.defer();
      self.find(appName)
        .success(function (data){
          self.setCurrentApp(data);
          currentApp.myStatus = {status : data.DatabaseStatus, oldStatus: apps.status[appName]};
          deferred.resolve(currentApp);
        })
        .error(function(err){
          deferred.reject(err);
        });

      return deferred.promise;

    };

    this.getAlert  = function(appName) {
      if (apps.alerts[appName] == null) {
        this.appDbStat(appName)
          .success(function (data) {
            if (data.tableCount == 0)
              apps.alerts[appName] = "Your database has no tables! go to <a href=''>Database Create</a> and run our existing schemas or use any Admin tool to add tables";
              return apps.alerts[appName];
          })
      }

      return apps.alerts[appName];

    };

    this.setAlert  = function(appName, msg) {
          apps.alerts[appName] = msg;
    };

    function searchStringInArray (str, strArray) {
      for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
      }
      return -1;
    }

    this.appNames = function(appName) {
      if (searchStringInArray(appName, apps.names) === -1){
        apps.names.push(appName);
      }
      return apps.names;
    };

    this.all = function() {
      $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps?pageSize=50'
      })
      .success(function (data) {
      if (data) {
          apps.list = data.data;
          updateAppNames();
          apps.deferred.resolve(apps);
      }
      })
      .error(function (error) {
        apps.deferred.reject(error);
      });

      return apps.deferred.promise;
    };

    this.find = function(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/'+appName+'?deep=true'});
    };

    this.add = function(name, title) {
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myApps/',
        data: {
                Name: name,
                Title: title
              }
      })
      .success(function(data) {
        deferred.resolve(data.data);
      })
      .error(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    this.appDbStat = function(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/app/dbStat',
        headers: {AppName: appName}
      });
    };

    this.update = function(name, newName, title) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+name,
        data: {
          Title: title,
          Name: newName
        }
      });
    };
  }

  angular.module('common.services')
    .service('AppsService',['$http', '$q', 'CONSTS','DatabaseNamesService', appsService]);

})();

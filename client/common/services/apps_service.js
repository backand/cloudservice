(function() {
  'use strict';

  function appsService($http, $q, CONSTS,DatabaseNamesService) {

    var self = this;

    var apps = {
      list: [],
      names: []
    };

    var currentApp;

    apps.deferred = $q.defer();

    function updateAppNames() {
      apps.names = [];

      apps.list.forEach(function(item) {
        apps.names.push(item.Name)
      })
    }

    this.setCurrentApp = function(data){
      currentApp = data;
      var Database_Source = data.Database_Source ? DatabaseNamesService.getName(data.Database_Source.Id) : 'none';
      currentApp.databaseName = Database_Source;
    };

    this.getCurrentApp = function(){
      return currentApp;
    };

    this.appNames = function() {
      return apps.names;
    };

    this.all = function() {
      $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps'
      })
      .success(function (data) {
        apps.list = data.data;
        updateAppNames();
        apps.deferred.resolve(apps);
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

    this.update = function(name, title) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+name,
        data: {
          Name: name,
          Title: title
        }
      });
    };

    this.refreshApp = function(appName){
      self.find(appName)
        .success( function(appItem){
          self.setCurrentApp(appItem)
      })
    };


    this.connect2DB = function(appName, data) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myAppConnection/'+appName,
        data: data
      });
    };

    this.createDB = function(appName, data) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myAppConnection/'+appName,
        data: {"product":"12"}
      });
    };

    this.getDBInfo = function(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myAppConnection/'+appName
      });
    };

    this.getAppPassword = function(appName){
        return $http({
          method: 'GET',
          url: CONSTS.appUrl + '/admin/myAppConnectionPassword/'+appName
        });
    };

    var dataSourcesArray = [
      {imgSrc: "client/assets/images/mysql.png", name: 'sqlserver'},
      {imgSrc: "client/assets/images/mysql.png", name: 'mysql'},
      {imgSrc: 'client/assets/images/mongodb.png', name: 'mongodb'},
      {imgSrc: 'client/assets/images/oracle.jpg', name: 'oracle'},
      {imgSrc: 'client/assets/images/postgresql.jpg', name: 'postgresql'}
    ];

    this.getDataSources = function() {
      return dataSourcesArray;
    };
  }

  angular.module('common.services')
    .service('AppsService',['$http', '$q', 'CONSTS','DatabaseNamesService', appsService]);

})();

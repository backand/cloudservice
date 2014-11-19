(function() {
  'use strict';

  function appsService($http, CONSTS) {

    this.currentApp = undefined;

    var allApps;

    var appsNames = [];

    var dataSourcesArray = [
      {imgSrc: "client/assets/images/mysql.png", name: 'sqlserver'},
      {imgSrc: "client/assets/images/mysql.png", name: 'mysql'},
      {imgSrc: 'client/assets/images/mongodb.png', name: 'mongodb'},
      {imgSrc: 'client/assets/images/oracle.jpg', name: 'oracle'},
      {imgSrc: 'client/assets/images/postgresql.jpg', name: 'postgresql'}
    ];

    function createAppNames (array){
      array.forEach(function(item){
        appsNames.push(item.Name)
      })
    }

    this.getDataSources = function(){
      return dataSourcesArray;
    };

    this.setAllApps = function(data){
      createAppNames(data);
      allApps = data;

    };

    this.getAllApps = function(){
      return allApps;
    };

    this.getAppsNames = function(){
      return appsNames;
    };


    this.all = function(){
      return $http({
          method: 'GET',
          url: CONSTS.appUrl + '/admin/myApps'
        });
    };

    this.find = function(appName){
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/myApps/'+appName+'?deep=true'});
    };

    this.add = function(name ,title){
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myApps/',
        data: {
                Name: name,
                Title: title
              }
      });
    };

    this.update= function(name,title){
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+name,
        data: {
          Name: name,
          Title: title
        }
      });
    };

    this.updateTemplate = function(name, templateId){
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+name,
        data: {
          ThemeId : templateId
        }
      });
    };

    this.connect2DB = function(appName,data){
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myAppConnection/'+appName,
        data: data
      });
    };

    this.createDB = function(appName,data){
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myAppConnection/'+appName,
        data: {"product":"12"}
      });
    };

  }

  angular.module('common.services')
    .service('AppsService',['$http', 'CONSTS', appsService]);

})();

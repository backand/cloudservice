(function() {
  'use strict';

  function DatabaseService($http,CONSTS) {

    this.updateTemplate = function(name, templateId) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/admin/myApps/'+name,
        data: {
          ThemeId : templateId
        }
      });
    };

    this.connect2DB = function(appName, data) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myAppConnection/'+appName,
        data: data
      });
    };

    this.reConnect2DB = function(appName, data) {
        return $http({
          method: 'PUT',
          url: CONSTS.appUrl + '/admin/myAppConnection/'+appName,
          data: data
        });
    };

    this.createDB = function(appName, product, sampleApp) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/myAppConnection/' + appName,
        data: {"product": product, "sampleApp": sampleApp}
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
        url: CONSTS.appUrl + '/admin/myAppConnection/getPassword/'+appName
      });
    };

    var dataSourcesArray = [
      {imgSrc: "assets/images/mysql.png", name: 'sqlserver'},
      {imgSrc: "assets/images/mysql.png", name: 'mysql'},
      {imgSrc: 'assets/images/mongodb.png', name: 'mongodb'},
      {imgSrc: 'assets/images/oracle.jpg', name: 'oracle'},
      {imgSrc: 'assets/images/postgresql.jpg', name: 'postgresql'}
    ];

    this.getDataSources = function() {
      return dataSourcesArray;
    };

  }

  angular.module('common.services')
    .service('DatabaseService',['$http','CONSTS', DatabaseService]);

})();

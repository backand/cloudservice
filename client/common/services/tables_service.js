(function() {
  'use strict';

  function TablesService($http, $q, CONSTS) {

    var self= this;
    self._tables = null;

    /**
     * Save the tables locally and return the promise
     * @param appName
     * @returns {*|webdriver.promise.Promise}
     */
    self.get = function(appName) {
      return _get(appName).then(function (data) {
        self._tables = data.data.data;
        return self._tables;
      })
    };

    self.tables = function(appName) {
      if(self._tables != null)
      {
        return $q.when(self._tables);
      }
      else{
        return self.get(appName);
      }
    };

    function _get(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/config?pageSize=200&pageNumber=1',
        headers: { AppName: appName },
        params: {
            filter: '[{fieldName:"SystemView", operator:"equals", value: false}]',
            sort: '[{fieldName:"captionText", order:"asc"}]'
        }
      });
    };
    self.add = function (appName,table) {
        return $http({
            method: 'POST',
            url: CONSTS.appUrl + '/1/table/config',
            headers: { AppName: appName },
            data:table
        });
    };
    self.update = function (appName,viewName,table) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/table/config/'+viewName,
        headers: { AppName: appName },
        data:table
      });
    };
    self.addSchema = function (appName,schema) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/table/config/template',
        headers: { AppName: appName },
        data:schema,
        dataType: 'json'
      });
    };

  }

  angular.module('common.services')
    .service('TablesService', ['$http', '$q', 'CONSTS', TablesService]);
})();

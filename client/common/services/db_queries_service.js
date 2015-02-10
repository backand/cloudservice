(function() {
  'use strict';

  function DbQueriesService($http, CONSTS, NotificationService) {

    var self = this;
    var baseUrl = '/1/query/';
    var configUrl = 'config/';
    var getPromise = null;
    var currentApp = null;

    self.get = function(appName) {
      if (!getPromise || currentApp != appName) {
        currentApp = appName;
        getPromise = _get(appName)
          .then(function (data) {
            self._queries = data.data.data;
            return self._queries;
          }
          , function (err) {
            NotificationService.add('error', 'cant get DB queries');
          });
      }
      return getPromise;
    };

    function _get(appName) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + baseUrl + configUrl,
        headers: { AppName: appName }
      });
    }

    self.getQuery = function (id) {
      var found = _.find(self._queries, {'__metadata': {'id' : id } });
      return found;
    };

    function _put(query, queryId, appName) {
      appName = appName || currentApp;
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + baseUrl + configUrl + queryId,
        headers: { AppName: appName },
        data: query
      });
    }

    self.saveQuery = function (query) {
      var queryId = query.__metadata.id;
      _put(query, queryId)
      .then(function (data) {
          NotificationService.add('success', 'Query saved');
          return data;
        }
        , function (err) {
          NotificationService.add('error', 'cant get DB queries');
        });
    };
  }


  angular.module('common.services')
    .service('DbQueriesService',['$http','CONSTS', 'NotificationService', DbQueriesService]);

})();

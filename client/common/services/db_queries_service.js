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

    function Query () {
      return {
        "database": "0",
        "name": "",
        "sQL": "",
        "parameters": "",
        "workspaceID": "",
        "precedent": false,
        "allowSelectRoles": "Admin,Public,User"
      }
    }
    self.getQuery = function (id) {
      if (!id)
        return new Query();
      var found = _.find(self._queries, {'__metadata': {'id' : id } });
      return found;
    };

    function _put(query, queryId) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + baseUrl + configUrl + queryId,
        headers: { AppName: currentApp },
        data: query
      });
    }

    function _post(query, appName) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + baseUrl + configUrl,
        headers: { AppName: currentApp },
        data: query
      });
    }

    function refresh() {
      getPromise = null;
      return self.get(currentApp);
    }

    self.saveQuery = function (query) {
      if (query.__metadata)
      {
        var queryId = query.__metadata.id;
        _put(query, queryId)
        .then(function (data) {
            NotificationService.add('success', 'Query saved');
            refresh();
          }
          , function (err) {
            NotificationService.add('error', "Can't get DB queries");
          });
      }
      else
      {
        _post(query)
          .then(function (data) {
            NotificationService.add('success', 'Query saved');
            var query = data.data;
            self._queries.push(query);
          }
          , function (err) {
            NotificationService.add('error', "Can't save query");
          });
      }
    };
  }


  angular.module('common.services')
    .service('DbQueriesService',['$http','CONSTS', 'NotificationService', DbQueriesService]);

})();

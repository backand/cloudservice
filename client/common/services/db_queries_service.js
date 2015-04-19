(function() {
  'use strict';

  function DbQueriesService($http, CONSTS, NotificationService) {

    var self = this;
    var baseUrl = '/1/query/';
    var configUrl = 'config/';
    var getPromise = null;
    var currentApp = null;
    self._queries = [];

    self.getQueries = function(appName) {
      if (!getPromise || currentApp != appName) {
        currentApp = appName;
        getPromise = _get(appName)
          .then(function (data) {
            self._queries = data.data.data;
            return self._queries;
          }
          , function () {
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
        "precedent": false
      }
    }
    self.getQuery = function (id) {
      return _.find(self._queries, {'__metadata': {'id' : id } });
    };

    self.getQueryForEdit = function (id) {
      return angular.copy(self.getQuery(id));
    };

    self.getNewQuery = function() {
      return new Query();
    };


    function _request(method, path, data) {
      return $http({
        method: method,
        url: CONSTS.appUrl + baseUrl + configUrl + path,
        headers: { AppName: currentApp },
        data: data
      });
    }

    function _put(query, queryId) {
      return _request('PUT', queryId, query)
    }

    function _post(query) {
      return _request('POST', '', query)
    }

    self.saveQuery = function (query) {
      if (query.__metadata) // edit query
      {
        var queryId = query.__metadata.id;
        return _put(query, queryId)
        .then(function (data) {
            NotificationService.add('success', 'Query saved');
            _.assign(self.getQuery(queryId), query);
            return data.data;
          }
          , function (err) {
            NotificationService.add('error', "Can't get DB queries");
          });
      }
      else // new query
      {
        return _post(query)
          .then(function (data) {
            NotificationService.add('success', 'New query saved');
            query = data.data;
            self._queries.push(query);
            return data.data;
          }
          , function (err) {
            NotificationService.add('error', "Can't save query");
          });
      }
    };

    function _delete(queryId) {
      return _request('DELETE', queryId, null)
    }

    self.deleteQuery = function (query) {
      return _delete(query.__metadata.id)
        .then (function(data) {
        _.remove(self._queries, self.getQuery(query.__metadata.id));
        return data;
      })
    };

    self.getQueryUrl = function (queryName, parameters) {
      return encodeURI(CONSTS.appUrl + baseUrl + 'data/' + queryName + '?parameters=' + JSON.stringify(parameters));
    };

    self.runQuery = function (currentApp, queryName, parameters) {
      return $http({
        method: 'GET',
        url: self.getQueryUrl(queryName, parameters),
        headers: { AppName: currentApp }
      });
    }

  }


  angular.module('common.services')
    .service('DbQueriesService',['$http', 'CONSTS', 'NotificationService', DbQueriesService]);

})();

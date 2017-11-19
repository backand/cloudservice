(function() {
  function DataService($http, CONSTS, AppsService, stringifyHttp) {
    var self = this;

    self.log = [];
    self.logIndex = {};

    function logAndExecute (http, log) {
      var logItem = {};
      if (log) {
        logItem = {
          requestJson: stringifyHttp(http),
          requestUrl: http.url,
          requestMethod: http.method,
          requestTitle: log,
          requestParams: http.params,
          requestData: http.data,
          // GENERATOR ADDON
          httpObject: http
          // END
        };

        self.log.unshift(logItem);
        self.logIndex.last = self.log.length - 1;
      }
      return $http(http)
        .then(function (response) {
          if (log && response.data) {
            logItem.response = angular.toJson(response.data, true);
          }
          return response;
        });
    }

    self.getDataSample = function (tableName, log, ignoreError) {
      var http = {
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        headers: {'AppName': AppsService.currentApp.Name},
        config: {ignoreError: ignoreError}
      };
      return logAndExecute(http, log ? 'Get Data' : null);
    };

    self.get = function(tableName, size, page, sort, filter, log) {
      var http = {
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
        params: {
          'pageSize': size,
          'pageNumber': page,
          'filter' : filter ? filter : [],
          'sort' : sort ? sort : []
        }
      };
      return logAndExecute(http, log ? 'Get Data' : null);
    };

    self.getItem = function(tableName, itemId, log) {
      var http = {
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + itemId,
        headers: { 'AppName': AppsService.currentApp.Name }
      };
      return logAndExecute(http, log ? 'Get Item' : null);
    };

    self.update = function(tableName, record, id, log) {
      var http = {
        method: 'PUT',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + id + '?returnObject=true',
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      };
      return logAndExecute(http, log ? 'Update Item' : null);
    };

    self.post = function(tableName, record, log) {
      var http = {
        method: 'POST',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '?returnObject=true',
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      };
      return logAndExecute(http, log ? 'New Item' : null);
    };

    self.delete = function(tableName, record, id, log) {
      var http = {
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + id,
        headers: { 'AppName': AppsService.currentApp.Name }
      };
      return logAndExecute(http, log ? 'Delete Item' : null);
    };

    /**
     * Returns a list of items {value (id), label} from the table related
     * to the given column, filtered by 'term'.
     * The filter is done on the descriptive column.
     */
    self.getAutocomplete = function (tableName, columnName, term, limit) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/view/data/autocomplete/' + tableName + '/' + columnName,
        params: {
          term: term,
          limit: limit || 20
        },
        headers: { AppName: AppsService.currentApp.Name }
      });
    };

    self.search = function (tableName, term, pageSize, pageNumber) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        params: {
          search: term,
          pageSize: pageSize || 20,
          pageNumber: pageNumber || 1
        },
        headers: { AppName: AppsService.currentApp.Name }
      });
    }

    self.bulkPost = function(tableName, records, log){
      if(!records){
        return;
      }
      var requests = [];
      records.forEach(function(record){
        requests.push({
          method: 'POST',
          url: CONSTS.appUrl + '/1/objects/' + tableName,
          data: record
        });
      });
      var http = {
        method: 'POST',
        url: CONSTS.appUrl + '/1/bulk',
        headers: { 'AppName': AppsService.currentApp.Name },
        data: requests
      };
      return logAndExecute(http, log ? 'New Items' : null);
    }
  }

  angular.module('common.services')
    .service('DataService', ['$http', 'CONSTS', 'AppsService', 'stringifyHttp', DataService]);

})();

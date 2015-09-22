(function() {
  function DataService($http, CONSTS, AppsService) {
    var self = this;

    self.log = [];

    function logAndExecute (http, log) {
      if (log) {
        self.log.push(http);
      }
      return $http(http);
    }

    self.get = function(tableName, size, page, sort, filter, log) {
      var http = {
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : typeof(filter) === 'undefined' ? '' : filter,
          'sort' : sort
        }
      };
      return logAndExecute(http, log);
    };

    self.update = function(tableName, record, id, log) {
      var http = {
        method: 'PUT',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + id,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      };
      return logAndExecute(http, log);
    };

    self.post = function(tableName, record, log) {
      var http = {
        method: 'POST',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      };
      return logAndExecute(http, log);
    };

    self.delete = function(tableName, record, id, log) {
      var http = {
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + id,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      };
      return logAndExecute(http, log);
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
  }

  angular.module('common.services')
    .service('DataService', ['$http', 'CONSTS', 'AppsService', DataService]);

})();

(function() {
  function DataService($http, CONSTS, AppsService) {
    var self = this;

    self.get = function(tableName, size, page, sort, filter) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : typeof(filter) === 'undefined' ? '' : filter,
          'sort' : sort
        }
      });
    };

    self.update = function(tableName, record, id) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + id,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      });
    };

    self.post = function(tableName, record) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/objects/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      });
    };

    self.delete = function(tableName, record, id) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/objects/' + tableName + '/' + id,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      });
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
    }
  }

  angular.module('common.services')
    .service('DataService', ['$http', 'CONSTS', 'AppsService', DataService]);

})();

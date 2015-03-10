(function() {
  function DataService($http, CONSTS, NotificationService, AppState) {
    var self = this;
    self.get = function(tableName, size, page, sort) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/' + tableName,
        headers: {
          'AppName': AppState.get()
        },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : '',
          'sort' : sort
        }
      });
    };
    self.update = function(tableName, record) {
      return $http({
        method: 'PUT',
        url: CONSTS.appUrl + '/1/table/data/' + tableName + '/' + record.Id,
        headers: {
          'AppName': AppState.get()
        },
        data: record
      });
    };
  }
  angular.module('common.services')
    .service('DataService', ['$http', 'CONSTS', 'NotificationService','AppState', DataService]);

})();
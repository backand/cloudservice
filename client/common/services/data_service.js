(function() {
  function DataService($http, CONSTS, AppsService) {
    var self = this;
    self.get = function(tableName, size, page, sort) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
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
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      });
    };

    self.post = function(tableName, record) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/1/table/data/' + tableName,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      });
    };

    self.delete = function(tableName, record) {
      return $http({
        method: 'DELETE',
        url: CONSTS.appUrl + '/1/table/data/' + tableName + '/' + record.Id,
        headers: { 'AppName': AppsService.currentApp.Name },
        data: record
      });
    };
  }
  angular.module('common.services')
    .service('DataService', ['$http', 'CONSTS', 'AppsService', DataService]);

})();

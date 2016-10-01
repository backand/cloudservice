(function () {
  angular.module('common.services')
    .service('SearchService', ['$http', 'CONSTS', SearchService]);

  function SearchService($http, CONSTS) {
    var self = this;
    self.appName = null;
    var SEARCH_URL = '/1/admin/search';

    self.get = function (query) {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + SEARCH_URL,
        params: {
          q: query
        },
        headers: {AppName: self.appName}
      });
    };
  }
})();

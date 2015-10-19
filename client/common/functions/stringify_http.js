(function () {

  angular.module('common.services')
    .factory('stringifyHttp', ['CONSTS', stringifyHttp]);

  function stringifyHttp (CONSTS) {

    return function (http) {
      var stringifiedHttp = 'return $http (' + angular.toJson(_.omit(http, 'headers'), true) + ');';
      stringifiedHttp = stringifiedHttp.replace(/"([\d\w\s]+)"\s*:/g, '$1:');
      stringifiedHttp = stringifiedHttp.replace(/"/g, "'");
      stringifiedHttp = stringifiedHttp.replace("'" + CONSTS.appUrl, "Backand.getApiUrl() + '");

      return stringifiedHttp;
    };
  }

})();

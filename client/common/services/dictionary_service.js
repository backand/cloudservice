(function () {

  /**
   * pull dictionary items from the server
   * @param $http
   * @param CONSTS
   * @constructor
   */
  function DictionaryService($http, CONSTS) {

    var self = this;
    var baseUrl = '/1/table/dictionary/';

    self.appName = null;
    self.tableName = null;

    self.get = function () {
      return $http({
          method: 'GET',
          url: CONSTS.appUrl + baseUrl + self.tableName + '/?deep=false&withSystemTokens=true',
          headers: {AppName: self.appName}
        })
      }
    }

    angular.module('app')
      .service('DictionaryService', ['$http','CONSTS',DictionaryService]);
  }());

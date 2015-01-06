/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesService($http, CONSTS) {

    var self= this;
    var baseUrl = '/1/businessRule';

    self.appName = null;
    self.tableId = null;

    self.get = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + baseUrl +'?filter=[{fieldName:"viewTable", operator:"in", value:'+self.tableId+'}]&sort=[{fieldName:"name", order:"asc"}]',
        headers: {AppName: self.appName}
      });
    };

    self.post = function (rule) {
      return $http({
        method: 'PUT',
        url : CONSTS.appUrl + baseUrl +'/'+rule.__metadata.id,
        data: rule,
        headers: {AppName: self.appName}
      })
    }
  }


  angular.module('app')
    .service('RulesService', ['$http', 'CONSTS', RulesService]);
}());

(function () {

  function RulesService($http, CONSTS) {

    var self= this;
    var baseUrl = '/1/businessRule';
    self.tableRuleUrl = '/1/table/action/';
    var logUrl = '/1/view/data/durados_Log';

    self.appName = null;
    self.tableId = null;
    self.tableName = null;

    self.get = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + baseUrl
          + '?filter=[{fieldName:"viewTable", operator:"in", value:'
          + self.tableId + '}]&sort=[{fieldName:"name", order:"asc"}]',
        headers: { AppName: self.appName }
      });
    };

    self.getRule = function (id) {
      return $http({
        method: 'GET',
        url : CONSTS.appUrl + baseUrl+ '/' + id,
        headers: { AppName: self.appName }
      })
    };

    self.post = function (rule) {
      return $http({
        method: 'POST',
        url : CONSTS.appUrl + baseUrl,
        headers: { AppName: self.appName },
        data: rule
      })
    };

    self.update = function (rule) {
      return $http({
        method: 'PUT',
        url : CONSTS.appUrl + baseUrl+ '/' + rule.__metadata.id,
        headers: { AppName: self.appName },
        data: rule
      })
    };

    self.remove = function (rule) {
      return $http({
        method: 'DELETE',
        url : CONSTS.appUrl + baseUrl+ '/' + rule.__metadata.id,
        headers: { AppName: self.appName },
        data: rule
      })
    };


    self.getTestUrl = function (rule, test, debug) {
      var parameters = angular.copy(test.parameters);
      if (debug)
        parameters['$$debug$$'] =  true;
      return encodeURI(
        CONSTS.appUrl +
        self.tableRuleUrl +
        self.tableName + '/' +
        test.rowId +
        '?name=' + rule.name +
        '&parameters=' + JSON.stringify(parameters));
    };

    self.testRule = function (rule, test) {
      return $http({
        method: 'GET',
        url : self.getTestUrl(rule, test, true),
        headers: { AppName: self.appName }
      })
    };

  }

  angular.module('common.services')
    .service('RulesService', ['$http', 'CONSTS', RulesService]);
}());

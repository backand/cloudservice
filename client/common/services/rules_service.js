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
        url: CONSTS.appUrl + baseUrl +'?filter=[{fieldName:"viewTable", operator:"in", value:'+self.tableId+'}]&sort=[{fieldName:"name", order:"asc"}]',
        headers: {AppName: self.appName}
      });
    };

    self.getRule = function (id) {
      return $http({
        method: 'GET',
        url : CONSTS.appUrl + baseUrl+ '/' + id,
        headers: {AppName: self.appName}
      })
    };

    self.post = function (rule) {
      return $http({
        method: 'POST',
        url : CONSTS.appUrl + baseUrl,
        data: rule,
        headers: {AppName: self.appName}
      })
    };

    self.update = function (rule) {
      return $http({
        method: 'PUT',
        url : CONSTS.appUrl + baseUrl+ '/' + rule.__metadata.id,
        data: rule,
        headers: {AppName: self.appName}
      })
    };

    self.remove = function (rule) {
      return $http({
        method: 'DELETE',
        url : CONSTS.appUrl + baseUrl+ '/' + rule.__metadata.id,
        data: rule,
        headers: {AppName: self.appName}
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

    // TODO: get log which is filtered by Guid from server
    self.getLog = function (guid) {
      return $http({
        method: 'GET',
        url : 'http://api.backand.info:8099/1/view/data/durados_Log?' +
              'filter=[{"fieldName":"LogType", "operator":"greaterThanOrEqualsTo","value":"500"},' +
              '{"fieldName":"Guid", "operator":"equals","value":"'+guid+'"}]',
        headers: {AppName: self.appName}
      })
    };

  }

  angular.module('app')
    .service('RulesService', ['$http', 'CONSTS', RulesService]);
}());

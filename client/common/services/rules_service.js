/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesService($http, CONSTS, $log) {

    this.get = function (appName, tableId) {
      $log.debug("rules get", appName, tableId);
      return $http({
        method: 'GET',
        //url: CONSTS.appUrl + '/1/businessRule?filter=[{fieldName:"viewTable", operator:"in", value:'+tableId+'}]&sort=[{fieldName:"name", order:"asc"}]',
        url: CONSTS.appUrl + '/1/businessRule?filter=[{fieldName:"viewTable", operator:"in", value:"20"}]&sort=[{fieldName:"name", order:"asc"}]',
        headers: {AppName: appName}
      });
    };
  }

  angular.module('app')
    .service('RulesService', ['$http', 'CONSTS', '$log', RulesService]);
}());

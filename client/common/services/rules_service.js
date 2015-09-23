(function () {

  function RulesService($http, CONSTS) {

    var self = this;
    var baseUrl = '/1/businessRule';
    self.tableRuleUrl = '/1/objects/';
    self.addUserUrl = '/1/user';
    var logUrl = '/1/objects/durados_Log';

    self.appName = null;
    self.tableId = null;
    self.tableName = null;

    self.dataActions = [
      {crud: 'update', value: 'OnDemand', label: 'On demand - Execute via REST API', level1: 0, level2: 0},
      {crud: 'create', value: 'BeforeCreate', label: 'Create - Before adding data', level1: 1, level2: 0},
      {crud: 'create', value: 'AfterCreateBeforeCommit', label: 'Create - After data saved but before it committed', level1: 1, level2: 1},
      {crud: 'create', value: 'AfterCreate', label: 'Create - After data saved and committed', level1: 1, level2: 2},
      {crud: 'update', value: 'BeforeEdit', label: 'Update - Before update data', level1: 2, level2: 0},
      {crud: 'update', value: 'AfterEditBeforeCommit', label: 'Update - After data saved but before it committed', level1: 2, level2: 1},
      {crud: 'update', value: 'AfterEdit', label: 'Update - After data saved and committed', level1: 2, level2: 2},
      {crud: 'delete', value: 'BeforeDelete', label: 'Delete - Before delete', level1: 3, level2: 0},
      {crud: 'delete', value: 'AfterDeleteBeforeCommit',label: 'Delete - After record deleted but before it committed',level1: 3,level2: 1},
      {crud: 'delete', value: 'AfterDelete', label: 'Delete - After record deleted and committed', level1: 3, level2: 2}
    ];

    self.actionTemplateCategories = [
      {id: 1, label: 'Mail'},
      {id: 2, label: 'Payment Processing'},
      {id: 3, label: 'File Storage'},
      {id: null, label: 'Other'}
    ];

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

    self.getActionTemplates = function () {
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/admin/actionTemplate'
      });
    };

    self.saveActionTemplate = function (rule) {
      return $http({
        method: 'POST',
        url: CONSTS.appUrl + '/admin/actionTemplate',
        data: rule
      });
    };

    self.getTestUrl = function (rule, test, actionType, tableName, debug, fromGetHttp) {
      var onDemand = actionType === 'On Demand';
      var parameters = angular.copy(test.parameters);
      if (debug) {
        parameters['$$debug$$'] =  true;
      }

      if (tableName === 'backandUsers' && actionType === 'Create') {
        return encodeURI(
          CONSTS.appUrl +
          self.addUserUrl +
          (debug ? '?parameters=' + JSON.stringify(parameters) : ''));
      }

      var rowId = test.rowId || '';

      var uri = CONSTS.appUrl +
        self.tableRuleUrl +
        (onDemand ? 'action/' : '') +
        tableName + '/' +
        rowId;

      if (fromGetHttp && !debug) {
        return encodeURI(uri);
      }

      return encodeURI(uri +
        ((onDemand || debug) ? '?' : '') +
        ( onDemand ? 'name=' + rule.name : '') +
        ((onDemand && !_.isEmpty(parameters)) ? '&' : '') +
        (!_.isEmpty(parameters) ? 'parameters=' + JSON.stringify(parameters) : ''));
    };

    self.testRule = function (rule, test, actionType, tableName, rowData) {
      return $http(self.getTestHttp(rule, test, actionType, tableName, rowData, true))
    };


    self.getTestHttp = function (rule, test, actionType, tableName, rowData, debug) {
      var method;
      switch (actionType) {
        case 'Create':
          method = 'POST';
          break;
        case 'Update':
          method = 'PUT';
          break;
        case 'Delete':
          method = 'DELETE';
          break;
        case 'On Demand':
        default:
          method = 'GET';
          break;
      }

      var http = {
        method: method,
        url : self.getTestUrl(rule, test, actionType, tableName, debug, true)
      };
      debug ?
        http.headers = { AppName: self.appName } :
        http.params = {
          name: rule.name,
          parameters: test.parameters
        };

      if (actionType === 'Create' || actionType === 'Update') {
        http.data = angular.fromJson(rowData);
      }

      return http;
    };

  }

  angular.module('common.services')
    .service('RulesService', ['$http', 'CONSTS', RulesService]);
}());

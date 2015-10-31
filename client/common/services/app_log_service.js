(function() {
  'use strict';

  function AppLogService($http, CONSTS) {

    var self = this;
    self.LOG_URL = '/1/table/data/durados_Log';
    self.HISTORY_URL = '/1/table/data/durados_v_ChangeHistory';

    self.getAppLog = function (appName, size, page, filterParam, sort) {
      //var filterParam = '[{fieldName:"Admin", operator:"equals", value:"' + isAdmin + '"}]';
      var sortParam = sort || '[{fieldName:"id", order:"desc"}]';
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + self.HISTORY_URL,
        headers: {'AppName': appName },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : filterParam,
          'sort' : sortParam
        }
      });
    };

    function arrangeMsg(item) {
      var log = item.__metadata.descriptives.Action.label + ' ' + item.FieldName + ' ';
      switch(item.__metadata.descriptives.Action.label) {
        case 'Update' :
          log += 'from ' + item.OldValue + " to " + item.NewValue;
          break;
        case 'Insert' :
          log += item.NewValue;
          break;
        case 'Delete' :
          log += item.OldValue;
          break;
      }
      return log;
    }

    self.createLogMsg = function (array) {
      var logMsgs = [];
      array.forEach(function(item){
        var msg = arrangeMsg(item);
        var label = item.__metadata.descriptives.Username.label;
        var info = msg.substr(0, 100) + " by " + label;
        var infoLong = msg + " by " + label;
        var long = (msg.length > 100);
        logMsgs.push({
          info : info,
          infoLong: infoLong ,
          long: long,
          open: false,
          time: item.UpdateDate,
          user: label
        });
      });
      return logMsgs;
    };

    self.getAppActivity = function(appName, size, page, filterParam, sort){
      //var filterParam = '[{fieldName:"LogType", operator:"equals", value:"' + (isException ? '1' : '3') + '"}]';

      return $http({
        method: 'GET',
        url: CONSTS.appUrl + self.LOG_URL,
        headers: { AppName: appName },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : filterParam,
          'sort' : sort
        }
      });
    };

    self.getActionLog = function (appName, guid) {
      return $http({
        method: 'GET',
        url : CONSTS.appUrl + self.LOG_URL,
        headers: { AppName: appName },
        params: {
          'pageSize': '100',
          'pageNumber': '1',
          'filter' : '[{"fieldName":"LogType", "operator":"greaterThanOrEqualsTo","value":"500"},' +
            '{"fieldName":"Guid", "operator":"equals","value":"' + guid + '"}]',
          'sort' : '[{fieldName:"ID", order:"desc"}]'
        }
      })
    };

  }

  angular.module('common.services')
    .service('AppLogService',['$http', 'CONSTS', AppLogService]);

})();

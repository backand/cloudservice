(function() {
  'use strict';

  function AppLogService($http, $q, CONSTS) {

    var self = this;

    self.getAppLog = function(appName, size, page, isAdmin, sort, tableName){
      var filterParam = '';
      if(isAdmin)
      {
        //filterParam = '[{fieldName:"Admin", operator:"equals", value:"true"},{fieldName:"ViewName", operator:"equals", value:"' + tableName + '"}]';
        filterParam = '[{fieldName:"Admin", operator:"equals", value:"true"}]';
      }
      else
      {
        filterParam = '[{fieldName:"Admin", operator:"equals", value:"false"}]';
      }
      var sortParam = '[{fieldName:"id", order:"desc"}]';
      if(sort)
        sortParam = sort;
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/durados_v_ChangeHistory',
        headers: {
          'AppName': appName
        },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : filterParam,
          'sort' : sortParam
        }
      });
    };

    function arrangeMsg(item){
      var log = '';
      switch(item.__metadata.descriptives.Action.label){
        case 'Update' :
          log = item.__metadata.descriptives.Action.label +" "+ item.FieldName +' from '+item.OldValue+" to "+item.NewValue;
          break;
        case 'Insert' :
          log = item.__metadata.descriptives.Action.label +" "+ item.FieldName +" "+item.NewValue;
          break;
        case 'Delete' :
          log = item.__metadata.descriptives.Action.label +" "+ item.FieldName +" "+item.OldValue;
          break;
      }
      return log;
    }

    self.createLogMsg = function(array){
      var logMsgs = [];
      array.forEach(function(item){
        var msg = arrangeMsg(item);
        var info = msg.substr(0,100) + " by " + item.__metadata.descriptives.Username.label;
        var infoLong = msg + + " by " + item.__metadata.descriptives.Username.label;
        var long = (msg.length>100);
        logMsgs.push({info : info, infoLong: infoLong ,long: long, open: false, time: item.UpdateDate, user: item.__metadata.descriptives.Username.label});
      });
      return logMsgs;
    }

    self.getAppActivity = function(appName, size, page, isException, sort){
      var filterParam = '';
      if(isException)
        filterParam = '[{fieldName:"LogType", operator:"equals", value:"1"}]';
      else
        filterParam = '[{fieldName:"LogType", operator:"equals", value:"3"}]';
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/table/data/Durados_Log',
        headers: {
          'AppName': appName
        },
        params: {
          'pageSize': String(size),
          'pageNumber': String(page),
          'filter' : filterParam,
          'sort' : sort
        }
      });
    };

  }

  angular.module('common.services')
    .service('AppLogService',['$http', '$q', 'CONSTS', AppLogService]);

})();

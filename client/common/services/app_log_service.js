(function() {
  'use strict';

  function AppLogService($http, $q, CONSTS) {

    var self = this;

    this.getAppLog = function(appName){
      return $http({
        method: 'GET',
        url: CONSTS.appUrl + '/1/view/data/durados_v_ChangeHistory',
        headers: {
          'AppName': appName
        },
        params: {
          'filter' : '[{fieldName:"Admin", operator:"equals", value:"true"}]',
          'sort' : '[{fieldName:"id", order:"desc"}]'
        }
      });
    };

    function arrangeMsg(item){
      var log = '';
      switch(item.Action){
        case 'Update' :
              log = item.Action +" "+ item.FieldName +' from '+item.OldValue+" to "+item.NewValue+" by ";
              break;
        case 'Insert' :
          log = item.Action +" "+ item.FieldName +" "+item.NewValue+" by ";
          break;
        case 'Delete' :
          log = item.Action +" "+ item.FieldName +" "+item.OldValue+" by ";
          break;
      }
      return log;
    }

    this.createLogMsg = function(array){
      var logMsgs = [];
      array.forEach(function(item){
        logMsgs.push({info : arrangeMsg(item), time: item.UpdateDate, user: item.Username});
      });
      return logMsgs;
    }


  }

  angular.module('common.services')
    .service('AppLogService',['$http', '$q', 'CONSTS', AppLogService]);

})();

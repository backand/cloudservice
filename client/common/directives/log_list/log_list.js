(function() {
  'use strict';

  angular.module('common.directives')
    .directive('logList', ['$rootScope','AppLogService', function ($rootScope, AppLogService) {
      return {
        restrict: 'A',
        scope: {
          appName : '@',
          logLimit : '@'
        },
        replace : true,
        templateUrl: 'common/directives/log_list/log_list.html',
        link: function(scope, element, attrs) {
          scope.logLimit = parseInt(scope.logLimit);
          var isAdmin = [{fieldName:"Admin", operator:"equals", value:"true"}];
          AppLogService.getAppLog(scope.appName, scope.logLimit,1,isAdmin)
            .success(function(data){
              scope.appLogArray = AppLogService.createLogMsg(data.data);
            })
            .error(function(err){

            });
        }
      };
    }
  ])

}());




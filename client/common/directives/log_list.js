(function() {
  'use strict';

  angular.module('common.directives',[])
    .directive('logList', ['$rootScope','AppLogService', function($rootScope,AppLogService) {
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
          scope.appLogArray = []; //todo: remove this
          AppLogService.getAppLog(scope.appName)
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



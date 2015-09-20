(function() {
  'use strict';

  angular.module('common.directives')
    .directive('baLanding', ['AuthLayoutService', baLanding]);


  function baLanding (AuthLayoutService) {
      return {
        scope: {
          baLanding: '@'
        },
        link: function(scope) {
          AuthLayoutService.flags.landing = !!scope.baLanding;

        }
      };
    }


}());

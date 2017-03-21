/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function Functions($state, AppsService, RulesService) {

    var self = this;
    (function init() {
      self.appName = AppsService.appName = $state.params.appName;
      //enable here the rules tab only for 'backandUsers'
      RulesService.appName = self.appName;
      RulesService.tableId = 15;

    }());

  }

  angular.module('backand')
    .controller('Functions', [
      '$state',
      'AppsService',
      'RulesService',
      Functions
    ]);

}());

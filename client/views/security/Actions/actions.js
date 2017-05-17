/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityActions($state, NotificationService, SecurityService, AppsService, RulesService, DictionaryService, $scope, CONSTS) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $state.params.appName;
      //enable here the rules tab only for 'backandUsers'
      RulesService.appName = DictionaryService.appName = self.appName;
      RulesService.tableId = 4;
      RulesService.tableName = CONSTS.backandUserObject
      DictionaryService.tableName = CONSTS.backandUserObject;
    }());

  }

  angular.module('backand')
    .controller('SecurityActions', [
      '$state',
      'NotificationService',
      'SecurityService',
      'AppsService',
      'RulesService',
      'DictionaryService',
      '$scope',
      'CONSTS',
      SecurityActions
    ]);

}());

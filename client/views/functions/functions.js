/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {
  'use strict';

   angular.module('backand.functions')
    .controller('FunctionsController', [
      '$state',
      'AppsService',
      'RulesService',
      FunctionsController
    ]); 

  function FunctionsController($state, AppsService, RulesService) {

    var self = this;
    (function init() {
      self.appName = AppsService.appName = $state.params.appName;
      //enable here the rules tab only for 'backandUsers'
      RulesService.appName = self.appName;
      RulesService.tableId = 15;

    }());
  }

 

}());

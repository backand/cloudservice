/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {
  'use strict';

   angular.module('backand.functions')
    .controller('FunctionsController', [
      '$state',
      '$stateParams',
      'AppsService',
      'RulesService',
      'CONSTS',
      FunctionsController
    ]); 

  function FunctionsController($state, $stateParams, AppsService, RulesService, CONSTS) {

    var self = this;
    (function init() {
      self.appName = AppsService.appName = $state.params.appName;
      //enable here the rules tab only for 'backandUsers'
      RulesService.appName = self.appName;
      RulesService.tableId = 15;
      RulesService.tableName = CONSTS.rootObject;
      self.id = $stateParams.functionId;
      RulesService.getRootObjectId().then(function(id){
        RulesService.tableId = id;
      });

    }());
  }

 

}());

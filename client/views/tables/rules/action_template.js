(function () {
  angular.module('backand')
    .controller('ActionTemplateController', ['$modalInstance', 'RulesService', 'action', ActionTemplateController]);

  function ActionTemplateController ($modalInstance, RulesService, action) {
    var self = this;

    self.actionTemplate = {
      name: action.name,
      shortDescription: "",
      documentation: "",
      ruleName: action.name,
      action: action.dataAction,
      ruleType: action.workflowAction,
      condition: action.whereCondition,
      parameters: action.inputParameters,
      code: action.code,
      executeCommand: action.command,
      executeMessage: action.executeMessage,
      json: {}
    };

    self.categories = RulesService.actionTemplateCategories;

    self.saveActionTemplate = function () {
      self.savingActionTemplate = true;
      self.actionTemplate.json = angular.toJson(self.actionTemplate.json);
      RulesService.saveActionTemplate(self.actionTemplate)
        .then(function () {
        $modalInstance.close();
      })
        .finally(function () {
          self.savingActionTemplate = false;
        });
    };

    self.cancelActionTemplate = function () {
      $modalInstance.dismiss('cancel');
    };
  }

}());

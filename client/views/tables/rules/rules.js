/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesController($modal, $scope, $window, RulesService, NotificationService, DictionaryService) {

    var self = this;

    /**
     * init an empty items array on scope
     * register an event listener.
     * init the open modal
     */
    (function init() {
      self.items = [];
      self.open = newRule;
      self.edit = editRule;
      self.clearRule = deleteRule;
      $scope.$on('tabs:rules', getRules);
      DictionaryService.get().then(populateDictionaryItems);
    }());


    $scope.modal = {
      title: 'Application Rule',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',
      dataActions: ['before create', 'before edit', 'before delete', 'after create', 'after edit', 'after create or edit', 'after delete'],
      workflowActions: ['notify', 'validate', 'execute', 'web service'],
      dictionaryState: false,
      dictionaryItems: {},
      insertAtChar: insertTokenAtChar,
      resetRule: resetCurrentRule,
      toggleOptions: toggleDictionary
    };

    /**
     * broadcast insert event from the parent scope
     * element id used by jquery to locate the element
     * @param elementId
     * @param token
     */
    function insertTokenAtChar(elementId, token) {
      $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, token]);
    }

    /**
     * success handle for getting dictionary items
     * @param data
     */
    function populateDictionaryItems(data) {
      var raw = data.data;
      var keys = Object.keys(raw);
      $scope.modal.dictionaryItems = {
        headings: {
          tokens: keys[0],
          props: keys[1]
        },
        data: {
          tokens: raw[keys[0]],
          props: raw[keys[1]]
        }
      };
    }

    /**
     * switch the state of the dictionary window
     */
    function toggleDictionary() {
      $scope.modal.dictionaryState = !$scope.modal.dictionaryState
    }

    /**
     * set the scope to update mode
     * and launch modal
     */
    function newRule() {
      $scope.modal.mode = 'new';
      resetCurrentRule();
      launchModal();
    }

    /**
     * put an existing rule on the scope,
     * set the scope mode to new,
     * and lunch the modal
     * @param rule
     */
    function editRule(rule) {
      $scope.rule = angular.copy(rule);
      $scope.modal.mode = 'update';
      launchModal();
    }

    function deleteRule(rule) {
      RulesService.remove(rule).then(getRules)
    }

    /**
     * init and launch modal window and
     * pass it a scope
     */
    function launchModal() {

      var modalInstance = $modal.open({
        templateUrl: 'views/tables/rules/new_rule.html',
        backdrop: 'static',
        scope: $scope
      });

      var defaultRule = {
        "viewTable": RulesService.tableId,
        "additionalView": "",
        "databaseViewName": "",
        "useSqlParser": false
      };

      /**
       * choose the close method depend on
       * modal mode
       *
       * @param rule
       */
      $scope.closeModal = function (rule) {
        switch ($scope.modal.mode) {
          case 'new':
            postNewRule(rule);
            break;
          case 'update':
            updateRule(rule);
            break;
        }
      };

      /**
       * extend the default rule object and
       * delegate to rulesService post method
       *
       * @param rule
       */
      function postNewRule(rule) {
        var data = angular.extend(defaultRule, rule);
        RulesService.post(data).then(getRules);
        modalInstance.close()
      }

      /**
       * delegate to the update method on
       * rules service
       *
       * @param rule
       */
      function updateRule(rule) {
        RulesService.update(rule).then(getRules);
        modalInstance.close();
      }

      /**
       * close the modal window if user confirm
       */
      $scope.cancel = function () {
        var result = $window.confirm('Changes will be lost. are sure you want to close this window?');
        result ? modalInstance.dismiss() : false;
      };

    }

    /**
     * reset the current active rule on scope
     */
    function resetCurrentRule() {
      $scope.rule = null;
    }

    /**
     * ajax call to get the rules list
     */
    function getRules() {
      RulesService.get().then(buildTree, errorHandler)
    }

    /**
     * parse the raw data object to a tree
     * and bind it to self
     *
     * @param data
     */
    function buildTree(data) {
      console.log(data.data.data);
      self.items = [
        {
          title: 'Create',
          items: [
            {
              title: 'Before',
              items: [{name: 'a rule name'}]
            },
            {
              title: 'During',
              items: [{name: 'a rule name'}, {name: 'a rule name'}]
            },
            {
              title: 'After',
              items: [{name: 'a rule name'},{name: 'a rule name'},{name: 'a rule name'}]
            }]
        }]
    }

    /**
     * delegate errors to the notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }
  }

  angular.module('app')
    .controller('RulesController', ['$modal', '$scope', '$window', 'RulesService', 'NotificationService', 'DictionaryService', RulesController]);
}());

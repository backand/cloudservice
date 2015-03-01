/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesController($scope, ConfirmationPopup, $filter, RulesService, NotificationService, DictionaryService, AppState, AppsService,AppLogService) {

    var self = this;
    var appName;
    /**
     * init an empty items array on scope
     * register an event listener.
     * init the open modal
     */
    (function init() {
      self.items = [];
      self.newAction = newRule;
      self.edit = editRule;
      loadDbType();
      $scope.$on('tabs:rules', getRules);
    }());

    $scope.ace = {
      dbType: 'sql',
      editors: {},
      onLoad: function(_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
      }
    };

    $scope.modal = {
      title: 'Action',
      namePattern: /^\w+$/,
      dataActions: [
        {value: 'OnDemand', label: 'On demand - Execute from REST API', level1: 0, level2: 0},
        {value: 'BeforeCreate', label: 'Create - Before adding data', level1: 1, level2: 0},
        {value: 'AfterCreateBeforeCommit', label: 'Create - During data saved before it committed', level1: 1, level2: 1},
        {value: 'AfterCreate', label: 'Create - After data saved and committed', level1: 1, level2: 2},
        {value: 'BeforeEdit', label: 'Update - Before update data', level1: 2, level2: 0},
        {value: 'AfterEditBeforeCommit', label: 'Update - During data saved before it committed', level1: 2, level2: 1},
        {value: 'AfterEdit', label: 'Update - After data saved and committed', level1: 2, level2: 2},
        {value: 'BeforeDelete', label: 'Delete - Before delete', level1: 3, level2: 0},
        {value: 'AfterDeleteBeforeCommit',label: 'Delete - During record deleted but before it committed',level1: 3,level2: 1},
        {value: 'AfterDelete', label: 'Delete - After record deleted and committed', level1: 3, level2: 2},
      ],
      workflowActions: [
        {value: 'JavaScript', label: 'Server side JavaScript code'},
        {value: 'Notify', label: 'Send Email'},
        {value: 'Execute', label: 'Transactional database script'}
      ],
      dictionaryItems: {},
      insertAtChar: insertTokenAtChar,
      resetRule: resetCurrentRule,
      digest: digestIn,
      toggleGroup: toggleGroup,
      isCurGroup: isCurGroup,
      buildParameters: buildParametersDictionary,
      toggleTestCode: toggleTestCode
    };

    function toggleTestCode() {
      $scope.modal.testCode = !$scope.modal.testCode;

    }

    $scope.isNew = function () {
      return (typeof this.rule.__metadata === 'undefined');
    };

    $scope.allowTestModal = function () {
      var allow = this.newRuleForm &&
        this.modal.testCode &&
        this.rule.dataAction == 'OnDemand';
      return allow;
    };

    $scope.allowTest = function() {
      var allow = this.allowTestModal() &&
        !this.newRuleForm.$dirty;
      return allow;
    };

    function isCurGroup(groupName) {
      return $scope.modal.curGroup == groupName;
    }

    function toggleGroup(groupName) {
      if ($scope.modal.isCurGroup(groupName)) {
        $scope.modal.curGroup = null;
      }
      else {
        $scope.modal.curGroup = groupName;
      }
    }

    /**
     * broadcast insert event from the parent scope
     * element id used by jquery to locate the element
     * @param elementId
     * @param token
     */
    function insertTokenAtChar(elementId, token) {
      // Handle case of ace editor:
      var aceEditor = $scope.ace.editors[elementId];
      if (aceEditor) {
        setTimeout(function() { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
          aceEditor.insert("{{" + token + "}}");
        })
      }
    // Handle regular text field using place-at-char directive:
      else {
        $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, "{{" + token + "}}"]);
      }
    }

    function digestIn(){
      angular.element()
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
          props: keys[1],
          parameters: 'Parameters'
        },
        data: {
          tokens: raw[keys[0]],
          props: raw[keys[1]],
          parameters: []
        }
      };
    }

    function buildParametersDictionary() {
      var keys = [];
      if($scope.rule.inputParameters){
        angular.forEach($scope.rule.inputParameters.replace(/ /g, '').split(','), function (param){
          keys.push({token: param, label: param})
        })
      }
      $scope.modal.dictionaryItems.data.parameters =  keys;
    }

    /**
     * launch modal
     */
    function newRule(trigger) {
      resetCurrentRule();
      if(trigger){
        $scope.rule.dataAction = trigger;
      }
      launchModal();
    }

    /**
     * return the rule object by
     * the provided name     *
     * @param rulname
     * @returns {*|XMLList|XML}
     */
    function getRuleByName(rulename) {
      return angular.copy($filter('filter')(self.rules, function (f) {
        return f.name === rulename;
      })[0])
    }

    /**
     * get the rule name from the tree and get the full rule data from server
     * @param rule
     */
    function editRule(ruleName) {
      var rule = getRuleByName(ruleName);
      RulesService.getRule(rule.__metadata.id).then(loadRule,errorHandler)
    }

    /**
     * Update rule in scope and open the edit dialog
     * @param data
     */
    function loadRule(data)
    {
      $scope.rule = data.data;
      launchModal();
    }

    $scope.modal.handleTabKey = function(e){
      // get caret position/selection
      if(e.keyCode === 9) { // tab was pressed
        var start = e.currentTarget.selectionStart;
        var end = e.currentTarget.selectionEnd;

        var target = e.target;
        var value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start)
        + "\t"
        + value.substring(end);

        // put caret at right position again (add one for the tab)
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
      }

    };

    /**
     * init and launch modal window and
     * pass it a scope
     */
    function launchModal() {

      $scope.modal.toggleGroup();
      $scope.clearTest();

      var defaultRule = {
        'viewTable': RulesService.tableId,
        'additionalView': "",
        'databaseViewName': "",
        'useSqlParser': true
      };

      /**
       * delete the provided rule
       * @param rule
       */
      $scope.delete = function (rule) {
        ConfirmationPopup.confirm('Are sure you want to delete this rule?')
          .then(function(result){
            if(result){
              RulesService.remove(rule).then(getRules);
              modalInstance.close();
            }
          });
      };

      /**
       * choose the close method depend on
       * modal mode
       *
       * @param rule
       */
      $scope.saveRule = function (rule) {
        var ruleToSend = replaceSpecialCharInCode(rule);
        if ($scope.isNew())
            postNewRule(ruleToSend);
        else
            updateRule(ruleToSend);
        this.newRuleForm.$setPristine();
        NotificationService.add('success', 'The action was saved');
      };

      /**
       * extend the default rule object and
       * delegate to rulesService post method
       *
       * @param rule
       */
      function postNewRule(rule) {
        var data = angular.extend(defaultRule, rule);
        RulesService.post(data)
          .then(function (response) {
            $scope.rule = response.data;
          })
          .then(getRules);
      }

      /**
       * delegate to the update method on
       * rules service
       *
       * @param rule
       */
      function updateRule(rule) {
        RulesService.update(rule).then(getRules);
      }

      /**
       * close the modal window if user confirm
       */
      $scope.cancel = function () {
        var close = true;
        if (this.newRuleForm.$pristine)
          $scope.rule = null;
        else {
          ConfirmationPopup.confirm('Changes will be lost. Are sure you want to close this window?')
          .then(function (result) {
            result ? $scope.rule = null : false;
          });
        }
      };
    }

    function replaceSpecialCharInCode(rule){
      var ruleToSend = angular.copy(rule);
      ruleToSend.code = ruleToSend.code.replace(/\+/g, "%2B");
      return ruleToSend;
    }
    $scope.clearTest = function () {
      this.modal.testCode = false;
      this.test = {
        parameters: {},
        rowId: ''
      };
    };

    $scope.getInputParameters = function () {
      var inputParameters = [];
      if ($scope.rule.inputParameters)
        inputParameters = $scope.rule.inputParameters.replace(/ /g, '').split(',');
      return inputParameters;
    };

    $scope.testData = function () {
      RulesService.testRule(this.rule, this.test)
        .then(getLog, errorHandler);
    };


    $scope.$watch('test.rowId', function(newVal, oldVal) {
        if(newVal === 0)
          $scope.test.rowId = '';
      });

    function getLog(response) {
      $scope.test.result = response.data;
      var guid = response.headers('Action-Guid');
      $scope.testUrl = RulesService.getTestUrl($scope.rule, $scope.test);
      AppLogService.getActionLog(AppState.get(),guid).then(showLog, errorHandler);
    }

    function showLog(response) {
      $scope.test.logMessages = [];
      response.data.data.forEach(function (log) {
        $scope.test.logMessages.push({text: log.FreeText, isError: log.LogType === '501', time: log.Time});
      });
    }

    var backandCallbackConstCode = {
      start: '/* globals\n\  $http: http service for AJAX calls\n\*/\n' +
             '\'use strict\';\n' +
             'function backandCallback(userInput, dbRow, parameters, userProfile) {',
      end:   '}'
    };

    $scope.codeRegex = /^\s*function\s+backandCallback\s*\(\s*userInput\s*,\s*dbRow,\s*parameters\s*,\s*userProfile\s*\)\s*\{(.|[\r\n])*}\s*$/;
    /**
     * reset the current active rule on scope
     */

    function loadDbType() {
      appName = AppState.get();
      AppsService.getCurrentApp(appName).then(function(app) {
        $scope.ace.dbType = (app.databaseName == 'mysql' && 'mysql' || 'pgsql');
      });
    }

    function resetCurrentRule() {
      $scope.rule = {};
      $scope.rule.code = $scope.rule.code ||
              backandCallbackConstCode.start + '\n' +
              '\t// write your code here\n\n' +
              '\treturn {};\n' +
              backandCallbackConstCode.end;
    }

    /**
     * ajax call to get the rules list
     */
    function getRules() {
      DictionaryService.get().then(populateDictionaryItems);
      RulesService.get().then(buildTree, errorHandler);
    }

    self.treeSign = function (item) {
      return item.items.length === 0 ? '' : ( item.visible ? '-' : '+' );
    };

    /**
     * parse the raw data object to a tree
     * and bind it to self
     *
     * @param data
     */
    function buildTree(data) {
      self.rules = data.data.data;
      self.items = [
        {
          title: 'On Demand',
          visible: true,
          items: [
            {
              visible: false,
              title: 'Execute',
              description: 'These actions fire based on a direct call to the REST API',
              dataAction: 'OnDemand',
              items: []
            }]
        },
        {
          title: 'Create',
          visible: true,
          items: [
            {
              visible: false,
              title: 'Before',
              dataAction: 'BeforeCreate',
              description: 'These actions execute before an object is created in the database',
              items: []
            },
            {
              visible: false,
              title: 'During',
              dataAction: 'AfterCreateBeforeCommit',
              description: 'These actions execute while the object is being created, occurring during the same transaction context',
              items: []
            },
            {
              visible: false,
              title: 'After',
              dataAction: 'AfterCreate',
              description: 'These actions fire after a new record has been added to the database',
              items: []
            }]
        },
        {
          title: 'Update',
          visible: true,
          items: [
            {
              visible: false,
              title: 'Before',
              dataAction: 'BeforeEdit',
              description: 'These actions execute before an object is updated in the database',
              items: []
            },
            {
              visible: false,
              title: 'During',
              dataAction: 'AfterEditBeforeCommit',
              description: 'These actions execute while the object is being updated, occurring during the same transaction context',
              items: []
            },
            {
              visible: false,
              title: 'After',
              dataAction: 'AfterEdit',
              description: 'These actions fire after a record has been modified in the database',
              items: []
            }]
        },
        {
          title: 'Delete',
          visible: true,
          items: [
            {
              visible: false,
              title: 'Before',
              dataAction: 'BeforeDelete',
              description: 'These actions execute before an object is deleted from the database',
              items: []
            },
            {
              visible: false,
              title: 'During',
              dataAction: 'AfterDeleteBeforeCommit',
              description: 'These actions execute while the object is being deleted, occurring during the same transaction context',
              items: []
            },
            {
              visible: false,
              title: 'After',
              dataAction: 'AfterDelete',
              description: 'These actions fire after a new record has been deleted from the database',
              items: []
            }]
        }];

      //build the tree
      angular.forEach(self.rules, function (value, key) {
        var obj = {name: value.name};
        var da = $filter('filter')($scope.modal.dataActions, function (f) {
          return f.value === value.dataAction;
        })[0];
        if (da) {
          self.items[da.level1].items[da.level2].visible = true;
          self.items[da.level1].items[da.level2].items.push(obj);
        }
      });

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
    .controller('RulesController',
      ['$scope',
      'ConfirmationPopup',
      '$filter',
      'RulesService',
      'NotificationService',
      'DictionaryService',
      'AppState',
      'AppsService',
      'AppLogService',
      RulesController]);
}());

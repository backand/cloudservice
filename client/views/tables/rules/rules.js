/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesController(CONSTS, $modal, $scope, ConfirmationPopup, $filter, RulesService, NotificationService, DictionaryService) {

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
      $scope.$on('tabs:rules', getRules);
    }());


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
        {value: 'Execute', label: 'Additional database script'},
        {value: 'Validate', label: 'Advanced Data Validation'},
        {value: 'WebService', label: 'Make HTTP call'}
      ],
      dictionaryItems: {},
      insertAtChar: insertTokenAtChar,
      resetRule: resetCurrentRule,
      digest: digestIn,
      toggleGroup: toggleGroup,
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
        (typeof this.newRuleForm.code !== 'undefined') &&
        this.rule.dataAction == 'OnDemand';
      return allow;
    };

    $scope.allowTest = function() {
      var allow = this.allowTestModal() &&
        !this.newRuleForm.$dirty;
      return allow;
    };

    function toggleGroup(obj) {
      $scope.modal.dictionaryState = false;
      $scope.modal.notifySubject = false;
      $scope.modal.notifyMessage = false;
      $scope.modal.webService = false;
      $scope.modal.sqlCommand = false;
      if(obj != undefined){
        return !obj;
      }
      else
        return false;
    }

    /**
     * broadcast insert event from the parent scope
     * element id used by jquery to locate the element
     * @param elementId
     * @param token
     */
    function insertTokenAtChar(elementId, token) {
      $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, token]);
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
        //$scope.rule.dataAction = angular.copy($filter('filter')($scope.modal.dataActions, function (a) {
        //  return a.value === trigger;
        //})[0])
      }
      launchModal();
    }

    /**
     * return the rule object by
     * the provided name     *
     * @param rulname
     * @returns {*|XMLList|XML}
     */
    function getRuleByName(rulname) {
      return angular.copy($filter('filter')($scope.rules.data, function (f) {
        return f.name === rulname;
      })[0])
    }

    /**
     * get the rule name from the tree and get the full rule data from server
     * @param rule
     */
    function editRule(rule) {
      var rule = getRuleByName(rule);
      RulesService.getRule(rule.__metadata.id).then(loadRule,errorHandler)
    }

    /**
     * Update rule in scope and open the edit dialog
     * @param data
     */
    function loadRule(data)
    {
      $scope.rule = data.data;
      // TODO: mock - remove when input parameters are retrieved from server
      $scope.rule.inputParameters = 'x,y,z,param1,param2';
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
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/rules/new_rule.html',
        backdrop: 'static',
        keyboard: false,
        scope: $scope
      });

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
          modalInstance.dismiss();
        else {
          ConfirmationPopup.confirm('Changes will be lost. Are sure you want to close this window?')
          .then(function (result) {
            result ? modalInstance.dismiss() : false;
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
        inputParameters: [],
        parameters: {},
        rowId: 1
      };
      if ($scope.rule.inputParameters) this.test.inputParameters = $scope.rule.inputParameters.replace(/ /g, '').split(',');
    };

    $scope.testData = function () {
      RulesService.testRule(this.rule, this.test.parameters, this.test.rowId)
        .then(getLog, errorHandler);
    };

    $scope.getTestUrl = function () {
      return encodeURI(
        CONSTS.appUrl +
        RulesService.tableRuleUrl +
        RulesService.tableName + '/' +
        this.test.rowId +
        '?name=' + this.rule.name +
        '&parameters=' + this.test.parameters)
    };

    function getLog(response) {
      $scope.test.result = response.data;
      RulesService.getLog()
        .then(showLog, errorHandler);
    }
    function showLog(response) {
      var guid = response.data.data[0].Guid;
      var filtered = _.filter(response.data.data, {'Guid': guid});
      $scope.test.logMessages = [];
      filtered.forEach(function (log) {
        $scope.test.logMessages.push({text: log.FreeText, isError: log.LogType === '501', time: log.Time});
      });
    }

    var backandCallbackConstCode = {
      start: 'function backandCallback(userInput, dbRow, parameters, userProfile) {',
      end: '}'
    };
    /**
     * reset the current active rule on scope
     */
    function resetCurrentRule() {
      $scope.rule = {};
      $scope.rule.code = $scope.rule.code ||
              backandCallbackConstCode.start + '\n' +
              '\t// write your code here\n' +
              '\treturn {};\n\n' +
              backandCallbackConstCode.end;
    }

    /**
     * validate JavaScript function code
     */
    $scope.codeValidator = {
      name: 'backandCallback',
      validate: function (code) {
        code = code.trim() || '';
        return (
          code.indexOf(backandCallbackConstCode.start) === 0) &&
          (code.lastIndexOf(backandCallbackConstCode.end) === code.length - 1);
      }
    };

    /**
     * ajax call to get the rules list
     */
    function getRules() {
      DictionaryService.get().then(populateDictionaryItems);
      RulesService.get().then(buildTree, errorHandler);
    }

    /**
     * parse the raw data object to a tree
     * and bind it to self
     *
     * @param data
     */
    function buildTree(data) {
      self.data = data.data.data;
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
          title: 'Edit',
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
      angular.forEach(data.data.data, function (value, key) {
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
    .controller('RulesController', ['CONSTS', '$modal', '$scope', 'ConfirmationPopup', '$filter', 'RulesService', 'NotificationService', 'DictionaryService', RulesController]);
}());

/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

  function RulesController($modal, $scope, ConfirmationPopup, $filter, RulesService, NotificationService, DictionaryService) {

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
      title: 'Application Rule',
      okButtonText: 'Save',
      cancelButtonText: 'Cancel',
      deleteButtonText: 'Delete',
      dataActions: [{value: 'BeforeCreate', label: 'Create - Before adding data', level1: 0, level2: 0},
        {
          value: 'AfterCreateBeforeCommit',
          label: 'Create - After data saved before it committed',
          level1: 0,
          level2: 1
        },
        {value: 'AfterCreate', label: 'Create - After data saved and committed', level1: 0, level2: 2},
        {value: 'BeforeEdit', label: 'Update - Before update data', level1: 1, level2: 0},
        {value: 'AfterEditBeforeCommit', label: 'Update - After data saved before it committed', level1: 1, level2: 1},
        {value: 'AfterEdit', label: 'Update - After data saved and committed', level1: 1, level2: 2},
        {value: 'BeforeDelete', label: 'Delete - Before delete', level1: 2, level2: 0},
        {
          value: 'AfterDeleteBeforeCommit',
          label: 'Delete - After record deleted but before it committed',
          level1: 2,
          level2: 1
        },
        {value: 'AfterDelete', label: 'Delete - After record deleted and committed', level1: 2, level2: 2},
        {value: 'BeforeViewOpen', label: 'Read - Before reading data from database', level1: 3, level2: 0},
        {value: 'Open', label: 'Read - After reading from database but before send to client', level1: 3, level2: 1}
      ],
      workflowActions: [{value: 'Notify', label: 'Send Email'},
        {value: 'Validate', label: 'Advanced Data Validation'},
        {value: 'Execute', label: 'Run additional database script'},
        {value: 'WebService', label: 'Make HTTP call'}
      ],
      dictionaryItems: {},
      insertAtChar: insertTokenAtChar,
      resetRule: resetCurrentRule,
      digest: digestIn,
      toggleGroup: toggleGroup
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
          props: keys[1]
        },
        data: {
          tokens: raw[keys[0]],
          props: raw[keys[1]]
        }
      };
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
     * return the rule object by
     * the provided name     *
     * @param rulname
     * @returns {*|XMLList|XML}
     */
    function getRuleByName(rulname) {
      return angular.copy($filter('filter')($scope.rules.data, function (f) {
        return f.name === rulname;
      })[0])
    };

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
      $scope.modal.mode = 'update';
      launchModal();
    }

    /**
     * init and launch modal window and
     * pass it a scope
     */
    function launchModal() {

      $scope.modal.toggleGroup();
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/rules/new_rule.html',
        backdrop: 'static',
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
      }

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
        modalInstance.close();
      };

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
        ConfirmationPopup.confirm('Changes will be lost. are sure you want to close this window?')
          .then(function(result){
            result ? modalInstance.dismiss() : false;
          });

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
      DictionaryService.get().then(populateDictionaryItems);
      RulesService.get().then(buildTree, errorHandler);
    };

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
          title: 'Create',
          visible: true,
          items: [
            {
              visible: false,
              title: 'Before',
              items: []
            },
            {
              visible: false,
              title: 'During',
              items: []
            },
            {
              visible: false,
              title: 'After',
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
              items: []
            },
            {
              visible: false,
              title: 'During',
              items: []
            },
            {
              visible: false,
              title: 'After',
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
              items: []
            },
            {
              visible: false,
              title: 'During',
              items: []
            },
            {
              visible: false,
              title: 'After',
              items: []
            }]
        },
        {
          title: 'Open',
          visible: true,
          items: [
            {
              visible: false,
              title: 'Before',
              items: []
            },
            {
              visible: false,
              title: 'After',
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
    .controller('RulesController', ['$modal', '$scope', 'ConfirmationPopup', '$filter', 'RulesService', 'NotificationService', 'DictionaryService', RulesController]);
}());

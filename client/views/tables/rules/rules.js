/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {
  angular.module('backand')
    .controller('RulesController',
    ['$scope',
      'AppsService',
      'SecurityService',
      'SessionService',
      'ConfirmationPopup',
      '$filter',
      'RulesService',
      'NotificationService',
      'DictionaryService',
      '$stateParams',
      'AppLogService',
      'DataService',
      'ObjectsService',
      'usSpinnerService',
      'ColumnsService',
      'CONSTS',
      'AnalyticsService',
      'EscapeSpecialChars',
      '$modal',
      'NodejsService',
      'SocketService',
      'stringifyHttp',
      '$localStorage',
      '$state',
      'TablesService',
      RulesController]);

  function RulesController($scope,
                           AppsService,
                           SecurityService,
                           SessionService,
                           ConfirmationPopup,
                           $filter,
                           RulesService,
                           NotificationService,
                           DictionaryService,
                           $stateParams,
                           AppLogService,
                           DataService,
                           ObjectsService,
                           usSpinnerService,
                           ColumnsService,
                           CONSTS,
                           AnalyticsService,
                           EscapeSpecialChars,
                           $modal,
                           NodejsService,
                           SocketService,
                           stringifyHttp,
                           $localStorage,
                           $state,
                           TablesService) {

    var self = this;
    /**
     * init an empty items array on scope
     * register an event listener.
     * init the open modal
     */
    function init() {
      self.isNewAction = false;
      self.showJsCodeHelpDialog = false;
      self.debugMode = 'debug';
      self.showTemplatesForm = !Number($stateParams.actionId)>0; //check if there is an action

      if ($localStorage.backand[self.appName].nodeJsShowHowItWorks === undefined) {
        $localStorage.backand[self.appName].nodeJsShowHowItWorks = true;
      }
      self.showHowItWorks = $localStorage.backand[self.appName].nodeJsShowHowItWorks;

      if ($localStorage.backand[self.appName].nodeJsShowFirstTimeInstallation === undefined) {
        $localStorage.backand[self.appName].nodeJsShowFirstTimeInstallation = false;
      }
      self.showFirstTimeInstallation = $localStorage.backand[self.appName].nodeJsShowFirstTimeInstallation;
      setTestActionTitle();
      getRules();
      self.getActionTemplates();

      usSpinnerService.spin("connecting-app-to-db");
      self.isAppOpened = !_.isEmpty(AppsService.currentApp);
      self.currentApp = AppsService.currentApp;
      if(self.currentApp.DatabaseStatus !== 0 && !_.isEmpty(AppsService.currentApp))
        AppsService.appKeys(self.currentApp.Name).then(setKeysInfo);
      self.getTokens();
      getAllActions(); //load all actions names for the test
    }

    //Wait for server updates on 'items' object
    SocketService.on('Rule.created', function (data) {
      //Get the 'items' object that have changed
      if(self.isNewAction && self.action && self.action.workflowAction == 'NodeJS' ){
        getRules().then(function(){
          self.showAction(self.action.name);
        });
      };
      if(!self.isNewAction && self.action && self.action.workflowAction == 'NodeJS' ){
        self.refreshTree();
      };
      //console.log(data);
    });

    function setKeysInfo(data){
      self.keys = data.data;
      self.masterToken = data.data.general;
    }

    self.getTokens = function(){

      //get first admin user token
      SecurityService.appName = self.currentApp.Name;
      SecurityService.getUserToken(SessionService.currentUser.username)
        .then(function (response) {
          self.userToken = response.data;
        });
    };

    $scope.$watch(function () {
      if(self.action) {
        return self.action.workflowAction;
      }
    }, function (newVal, oldVal) {
      if (newVal == 'JavaScript') {
        $scope.$evalAsync(function () {
          var editor = ace.edit('code');
          if ($stateParams.line && $stateParams.col) {
            editor.resize(true);


            var range = new Range($stateParams.line, 0, $stateParams.line, 10000);
            var searchOptions = {};
            searchOptions.start = range;
            editor.findAll($stateParams.q, {}, true);
            //editor.scrollToLine($stateParams.line, true, true, function () {});
            //editor.gotoLine($stateParams.line, $stateParams.col, true);
            //editor.setHighlightActiveLine(true);
          }
        });
      }
    });


    self.getActionTemplates = function () {
      return RulesService.getActionTemplates()
        .then(function (result) {
          result.data.data.forEach(function (template) {
            try {
              if (template.json)
                template.json = angular.fromJson(template.json);
            } catch (error) {
                console.log(error);
            }

            var groupedNotOrdered = _.groupBy(_.sortBy(result.data.data, 'ordinal'), 'category');
            var res = [];
            _.each(RulesService.actionTemplateCategories, function(rule){
              var fromService = _.find(groupedNotOrdered, function(g){
                return rule.id ==  g[0].category;
              });

              if(fromService) {
                fromService.label = rule.label;
                res.push(fromService);
              }
            });

            self.actionTemplates = res;
          });
        });
    };

    self.getNodeInitCommand = function () {
      return 'backand action init --app ' + self.currentApp.Name + ' --object ' + self.getTableName() + ' ' + self.getCliActionName() + ' --master ' + self.masterToken + ' --user ' + self.userToken;
    };

    self.getNodeDeployCommand = function () {
      return 'backand action deploy --app ' + self.currentApp.Name + ' --object ' + self.getTableName() + ' ' + self.getCliActionName() + ' --master ' + self.masterToken + ' --user ' + self.userToken;
    };

    self.selectTemplate = function (template) {
      if (!self.action) {
        self.newAction(null,template.name);
      }

      self.action.name = self.action.name || template.ruleName;
      self.action.dataAction = self.action.dataAction || template.action || 'OnDemand';
      self.showTemplatesForm = false;

      _.assign(self.action, {
        workflowAction: template.ruleType,
        whereCondition: template.condition,
        inputParameters: template.parameters,
        code: template.code,
        command: template.executeCommand,
        executeMessage: template.executeMessage
      });
    };

    self.saveActionTemplate = function () {
      openActionTemplateModal();
    };

    function openActionTemplateModal () {
      var modalInstance = $modal.open({
        templateUrl: 'views/tables/rules/action_template_modal.html',
        controller: 'ActionTemplateController as actionTemplateCtrl',
        resolve: {
          action: function () {
            return self.action;
          }
        }
      });

      modalInstance.result.then(function () {
        self.getActionTemplates();
      });
    }


    var defaultRule = {
      'viewTable': RulesService.tableId,
      'additionalView': "",
      'databaseViewName': "",
      'useSqlParser': true
    };

    self.newAction = function (trigger, templateName) {
      // Remove action id route param
      $state.go(".", {actionId: null}, {notify: false});

      if (self.action) {
        refreshAction();
        self.clearTest();
        self.isNewAction = false;
        return;
      }
      AnalyticsService.track('Template Selected', {template: templateName || "New Blank"});

      self.showJsCodeHelpDialog = false;
      self.showTemplatesForm = false;
      self.action = {
        whereCondition: 'true',
        code: backandCallbackConstCode.start + '\n' +
        '\t// write your code here\n\n' +
        '\treturn {};\n' +
        backandCallbackConstCode.end
      };

      if (trigger) {
        self.action.dataAction = trigger;
      }

      self.clearTest();
      self.editAction();
      self.isNewAction = true;
      self.isNodeJS = self.action && self.action.workflowAction == 'NodeJS';
    };

    self.showAction = function (actionName) {
      self.showJsCodeHelpDialog = false;
      self.isNewAction = false;
      var action = getRuleByName(actionName);
      refreshAction(action)
        .then(self.clearTest);
    };

    // Show action with route change
    self.goToAction = function (name) {
      var action = _.filter(self.ruleList, function (rule) {
        return rule.name == name;
      })[0];

      if (action.viewTable == 4) {
        $state.go('security.actions', {actionId: action.__metadata.id});
      } else {
        $state.go('object_actions', {actionId: action.__metadata.id});
      }
    };

    function refreshAction(action) {
      //self.editMode = false;
      self.requestTestForm = ($stateParams.test === "true");
      self.showJsCodeHelpDialog = false;
      self.isNodeJS = action && action.workflowAction == 'NodeJS';

      $scope.modal.toggleGroup();
      if (self.newRuleForm){
        self.newRuleForm.$setPristine();
      }
      if (action && action.__metadata) {
        return RulesService.getRule(action.__metadata.id).then(loadAction, errorHandler);
      }
      else {
        self.action = null;
        self.showTemplatesForm = true;
        self.toggleTestForm(false);
      }

    }

    function loadAction(data) {
      self.action = data.data;
      if (self.isNodeJS){
        NodejsService.actionName = self.action.name;
        NodejsService.objectName = self.getTableName();
        if (self.refreshTree) {
          self.refreshTree();
        }
      }
    }

    self.allowEditAction = function () {
      return (self.action && self.action.__metadata && !self.editMode);
    };

    self.editAction = function () {
      self.editMode = true;
      $scope.modal.toggleGroup();
      buildParametersDictionary();
    };

    self.clearTest = function () {
      self.test = {
        parameters: {},
        body: '{}',
        method: 'GET'
      };
      getTestRow();
      setTestActionTitle();
      buildParametersDictionary();

    };

    function getTestRow() {

      if(self.getDataActionType() === 'On Demand'){
        self.test.rowId = "";
        self.test.isGuid = false;
      } else {
        if (self.getDataActionType() === 'Create')
          self.getNewRow();
        else
          self.getFirstRow();
      }
    }

    self.doneEdit = function () {
      self.editMode = false;
      refreshAction(self.action);
    };

    self.cancelEdit = function () {
      if (!self.isNodeJS) {
        ConfirmationPopup.confirm('Changes will be lost. Are sure you want to cancel editing?', 'Cancel Editing', 'Continue Editing')
          .then(function (result) {
            if(result) {
              self.editMode = false;
              refreshAction(self.action);
            }
          });
      }
      else{
        self.editMode = false;
        refreshAction(self.action);
      }

    };

    self.saveAction = function (withTest) {
      self.saving = true;
      withTest ? self.savingAndTesting = true : null;
      self.testUrl = '';
      self.testHttp = '';
      buildParametersDictionary();
      self.action.inputParameters = _.trimRight(self.action.inputParameters, ',');

      var ruleToSend = EscapeSpecialChars(self.action);
      updateOrPostNew(ruleToSend, self.action.__metadata)
        .then(getRules)
        .then(function () {
          self.newRuleForm.$setPristine();
          NotificationService.add('success', 'The action was saved');

          AnalyticsService.track('AddedRule', {rule: self.action.name});

          self.saving = false;
          self.savingAndTesting = false;
          self.isNewAction = false;
          if (withTest)
            self.testData();
          self.requestTestForm = true; //always open test after save on demand action
        }, function () {
          self.saving = false;
          self.savingAndTesting = false;
        });
    };

    function updateOrPostNew(action, isUpdate) {
      if (isUpdate)
        return updateRule(action);
      else
        return postNewRule(action);
    }

    self.deleteAction = function () {
      self.showJsCodeHelpDialog = false;
      ConfirmationPopup.confirm('Are sure you want to delete this rule?')
        .then(function (result) {
          if (result) {
            self.editMode = false;
            RulesService.remove(self.action)
              .then(getRules)
              .then(refreshAction);
          }
        });
    };

    self.allowTestForm = function () {
      var allow = self.action &&
        self.action.__metadata;
      return allow;
    };

    self.toggleTestForm = function (show) {

      if(angular.isDefined(show)) {
        self.requestTestForm = show;
      } else{
        self.requestTestForm = !self.requestTestForm;
      }

      $state.go('.', {test: self.requestTestForm}, {notify: false});
    };

    self.showTestForm = function () {
      return (self.requestTestForm && self.allowTestForm());
    };

    self.allowTest = function () {

      if(self.test)
        self.allowTestEditMode = self.test.rowId != null || (self.test.rowId == null && self.getDataActionType() != 'Delete' && self.getDataActionType() != 'Update');

      return self.newRuleForm && self.newRuleForm.$pristine;

    };

    $scope.ace = {
      dbType: AppsService.currentApp.databaseName == 'mysql' && 'mysql' || 'pgsql',
      editors: {},
      onLoad: function (_editor) {
        $scope.ace.editors[_editor.container.id] = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    $scope.modal = {
      title: 'Action',
      dataActions: RulesService.dataActions,
      workflowActions: getWorkflowActions(),
      insertAtChar: insertTokenAtChar,
      digest: digestIn,
      toggleGroup: toggleGroup,
      isCurGroup: isCurGroup,
      buildParameters: buildParametersDictionary
    };
    self.workflowActions = getWorkflowActions();

    self.onDataActionChange = function(){
      self.workflowActions = getWorkflowActions();
      self.onTypeChange();
    };

    self.onTypeChange = function(){
      if(self.action.workflowAction == "NodeJS" && self.action.dataAction != "OnDemand")
        self.action.workflowAction = "";

      self.isNodeJS = self.action && self.action.workflowAction == 'NodeJS';
    };

    function getWorkflowActions(){
      if (self.action && self.action.dataAction == "OnDemand") {
        return [
          {value: 'JavaScript', label: 'Server side JavaScript code'},
          {value: 'NodeJS', label: 'Server side node.js code'},
          {value: 'Notify', label: 'Send Email'},
          {value: 'Execute', label: 'Transactional sql script'}
        ];
      } else {
        return [
          {value: 'JavaScript', label: 'Server side JavaScript code'},
          {value: 'Notify', label: 'Send Email'},
          {value: 'Execute', label: 'Transactional sql script'}
        ];
      }
    }

    self.anchorParams = {
      showAnchorCondition: isEditMode,
      toggleAngledWindow: $scope.modal.toggleGroup,
      showAngledWindow: $scope.modal.isCurGroup,
      dictionaryItems: self.dictionaryItems,
      insertAtChar: insertTokenAtChar,
      template: "views/tables/rules/dictionary_window.html",
      dictionarySections: ['userInput', 'dbRow', 'parameters', 'userProfile'],
      getDictionaryItems: getDictionaryItems
    };

    self.getDictionary = function (crudAction) {
      return self.dictionaryItems[crudAction]
    };

    function isEditMode() {
      return self.editMode;
    }

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
        setTimeout(function () { // DO NOT USE $timeout - all changes to ui-ace must be done outside digest loop, see onChange method in ui-ace
          aceEditor.insert("{{" + token + "}}");
        })
      }
      // Handle regular text field using place-at-char directive:
      else {
        $scope.$parent.$broadcast('insert:placeAtCaret', [elementId, "{{" + token + "}}"]);
      }
    }

    function digestIn() {
      angular.element()
    }


    /**
     * ajax call to get the rules list
     */
    function getRules() {
      self.dictionaryItems = {parameters: []};
      var crud = ['create', 'update', 'delete'];
      crud.forEach(function (crudAction) {
        DictionaryService.get(crudAction)
          .then(function (data) {
            usSpinnerService.stop('loading');
            populateDictionaryItems(crudAction, data.data)
          });
      });
      return RulesService.get().then(buildTree, errorHandler);
    }

    /**
     * success handle for getting dictionary items
     * @param data
     */
    function populateDictionaryItems(crudAction, data) {
      self.dictionaryItems[crudAction] = {
        userInput: data.userInput,
        userProfile: data.systemTokens,
        dbRow: data[getTableName()]
      };
    }

    function getTableName() {
      return $stateParams.tableId ? RulesService.tableName : CONSTS.backandUserObject;
    }

    self.getTableName = getTableName;

    function getDictionaryItems(dictionarySection) {
      if (dictionarySection === 'parameters') return self.dictionaryItems.parameters;
      return self.dictionaryItems[_.find(RulesService.dataActions, {value: self.action.dataAction}).crud][dictionarySection];
    }

    function buildParametersDictionary() {
      var keys = [];
      if (self.action && self.action.inputParameters) {
        self.test.inputParametersArray = _.compact(self.action.inputParameters.replace(/ /g, '').split(','));
        // remove properties that don't exist in the array
        self.test.parameters = _.pick(self.test.parameters, self.test.inputParametersArray);
        angular.forEach(self.test.inputParametersArray, function (param) {
          keys.push({token: param, label: param});
          self.test.parameters[param] = self.test.parameters[param] || '';
        })
      }
      self.dictionaryItems.parameters = keys;
    }

    /**
     * launch modal
     */


    /**
     * return the rule object by
     * the provided name     *
     * @param rulname
     * @returns {*|XMLList|XML}
     */
    function getRuleByName(rulename) {
      return angular.copy($filter('filter')(self.ruleList, function (f) {
        return f.name === rulename;
      })[0])
    }

    var constRuleNames = ['newUserVerification', 'requestResetPassword', 'userApproval', 'beforeSocialSignup','backandAuthOverride'];

    self.isConstName = function (ruleName) {
      return (self.getTableName() === 'backandUsers' && constRuleNames.indexOf(ruleName) > -1);
    };

    $scope.modal.handleTabKey = function (e) {
      // get caret position/selection
      if (e.keyCode === 9) { // tab was pressed
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
     * extend the default rule object and
     * delegate to rulesService post method
     *
     * @param rule
     */
    function postNewRule(rule) {
      var data = angular.extend(defaultRule, rule);
      return RulesService.post(data)
        .then(function (response) {
          self.action = response.data;
        });
    }

    /**
     * delegate to the update method on
     * rules service
     *
     * @param rule
     */
    function updateRule(rule) {
      return RulesService.update(rule);
    }

    function getDefaultValue(type) {
      switch (type) {
        case 'Numeric':
          return 0; // Also floats, so can't use number
        case 'DateTime':
          return new Date();
        case 'ShortText':
        case 'LongText':
          return 'text';
        case 'Boolean':
          return false;
        case 'SingleSelect':
          return null;
        default:
          return 'text';
      }
    }

    self.getNewRow = function () {

      if (getTableName() === 'backandUsers') {
        return setTestRowData({
          email: "email",
          firstName: "text",
          lastName: "text",
          role: "User",
          password: "text",
          confirmPassword: "text"
        });
      }

      ColumnsService.tableName = getTableName();
      ColumnsService.get()
        .then(function (data) {
          var newRow = {};
          data.fields.forEach(function (field) {
            if (field.type !== 'MultiSelect' && !field.form.hideInCreate)
              newRow[field.name] = getDefaultValue(field.type);
          });
          setTestRowData(newRow);
        })
    };

    self.getFirstRow = function () {
      usSpinnerService.spin('loading-row');
      return DataService.get(getTableName(), 1, 1, '')
        .then(function (data) {
          if(data.data.data.length>0){
            setTestRowData(data.data.data[0]);
            var id = data.data.data[0].__metadata.id;
            if (!isNaN(parseFloat(id)) && isFinite(id)) {
              // numeric id
              self.test.isGuid = false;
              self.test.rowId = parseInt(data.data.data[0].__metadata.id)
            } else {
              // guid
              self.test.isGuid = true;
              self.test.rowId = data.data.data[0].__metadata.id
            }
            console.log(self.test.rowId);
          }
          else
            self.test.rowId = null;
        }, function () {
          errorTestRowData('No data found');
        });
    };

    self.getRow = function (id) {
      if(id == null || id == ''){
        self.testRowObjectNotification = null;
        self.rowData = '';
        usSpinnerService.stop('loading-row');
        return;
      }
      usSpinnerService.spin('loading-row');

      return ObjectsService.getObject(getTableName(), id)
        .then(function (data) {
          setTestRowData(data.data);
        }, function () {
          errorTestRowData('No data exists with the specified Item Id');
        });
    };

    function setTestRowData(data) {
      usSpinnerService.stop('loading-row');
      self.testRowObjectNotification = null;
      self.rowData = JSON.stringify(_.omit(data, ['__metadata']), null, '\t');
    }

    function errorTestRowData(errorMessage) {
      setTestRowData();
      self.testRowObjectNotification = errorMessage;
    }

    //self.getInputParameters = function () {
    //  var inputParameters = [];
    //  if (self.action && self.action.inputParameters)
    //    inputParameters = self.action.inputParameters.replace(/ /g, '').split(',');
    //  //check if the parameter exists or not
    //  //angular.forEach(self.test.parameters, function(param){
    //  //  var ip = _.find(inputParameters, function(inputParam){ return inputParam === param });
    //  //  if(!ip)
    //  //    self.test.parameters.splice(param,1);
    //  //});
    //  self.test.parameters = angular.copy(inputParameters);
    //};


    self.ace = {
      onLoad: function (_editor) {
        self.ace.editor = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.aceStack = {
      onLoad: function (_editor) {
        self.aceStack.editor = _editor;
        _editor.$blockScrolling = Infinity;
      }
    };

    self.aceResponse = {
      onLoad: function (_editor) {
        self.aceResponse.editor = _editor;
        _editor.renderer.setOption('showLineNumbers', false);
        _editor.$blockScrolling = Infinity;
      }
    };

    self.aceBody = {
      onLoad: function (_editor) {
        self.aceBody.editor = _editor;
        _editor.renderer.setOption('showLineNumbers', false);
        _editor.$blockScrolling = Infinity;
      }
    };


    $scope.$watch(function () {
      if (self.action)
        return self.getDataActionType();
    }, function (newVal, oldVal) {

      if (self.ace && self.ace.editor) {
        self.clearTest(); //clear the data
        if (newVal === 'On Demand' || newVal === 'Delete') {
          self.ace.editor.setReadOnly(true);
          self.ace.message = 'Row data (read only)';
        }
        else {
          self.ace.message = 'Data to send in the test';
          self.ace.editor.setReadOnly(false);
        }
      }
    })

    $scope.$watch(function() {
      return self.showHowItWorks;
    }, function (newVal, oldVal) {
      $localStorage.backand[self.appName].nodeJsShowHowItWorks = newVal;
    });

    $scope.$watch(function() {
      return self.showFirstTimeInstallation;
    }, function (newVal, oldVal) {
      $localStorage.backand[self.appName].nodeJsShowFirstTimeInstallation = newVal;
    });

    self.testData = function () {
      //getTestRow();
      self.test.testLoading = true;
      RulesService.testRule(self.action, self.test, self.getDataActionType(), getTableName(), self.rowData, self.debugMode == 'debug')
        .then(getLog, getLog);
    };

    $scope.$watch(function () {
      if (self.test)
        return self.test.rowId
    }, function (newVal, oldVal) {
      if (typeof newVal != 'undefined' && newVal !== oldVal)
        self.getRow(newVal);
    });

    function getLog(response) {
      self.test.testLoading = false;
      if (response != 'Invalid JSON') {
        self.test.resultStatus = {code: response.status, text: response.statusText};

        try {
          if ($.isPlainObject(response.data) || $.isArray(response.data)) { //check if the response is a JSON
            self.test.result = "\n\n" + JSON.stringify(response.data, null, 2);
            window.setTimeout(function () {
              self.aceResponse.editor.getSession().setMode('ace/mode/json');
            }, 100);
          } else {
            self.test.result = "\n\n\n" + response.data.replace(/"/g, "");
            window.setTimeout(function () {
              self.aceResponse.editor.getSession().setMode('ace/mode/html');
            }, 100);
          }
        }
        catch(e){
          self.test.result = response.data;
          window.setTimeout(function () {
            self.aceResponse.editor.getSession().setMode('ace/mode/html');
          }, 100);
        }

        var guid = response.headers('Backand-Action-Guid');
        //self.testUrl = RulesService.getTestUrl(self.action, self.test, self.getDataActionType(), getTableName(), self.debugMode == 'debug');
        self.testHttpObject = RulesService.getTestHttp(self.action, self.test, self.getDataActionType(), getTableName(), self.rowData, self.debugMode == 'debug');
        self.testUrl = self.testHttpObject.url;
        self.testHttpObject.params = {parameters: self.test.parametersToSend};
        self.testHttp = stringifyHttp(self.testHttpObject);
        self.inputParametersForm.$setPristine();
        self.testUrlCopied = false;
        self.testHttpCopied = false;
        if (self.debugMode == 'debug') {
          AppLogService.getActionLog($stateParams.appName, guid)
            .then(showLog, errorHandler);
          AppLogService.getCallStack($stateParams.appName, guid)
              .then(showCallStack, errorHandler);
        } else {
          self.test.logMessages = [];
          self.test.logMessages.push({
            text: '** In Test Mode "Production" there are no debug messages',
            isError: true,
            time: new Date()
          });
        }
      }
    }

    function showLog(response) {
      self.test.logMessages = [];
      response.data.data.forEach(function (log) {
        if(log.LogType == 500 || log.LogType == 501){
          var newText = log.FreeText;
          if(log.LogType == 501){
            newText = addLinksToActions(log.FreeText);
          }
          self.test.logMessages.push({text: newText, isError: log.LogType == 501, time: log.Time});
        }
      });
      self.test.testLoading = false;
    }

    function showCallStack(response){
      var res = (response.data.length === 1) ? response.data[0] : response.data;
      self.test.callStack = "\n\n" + JSON.stringify(res, null, 2);
      window.setTimeout(function() { self.aceStack.editor.getSession().foldAll(6,null,2); }, 100);
      self.aceStack.editor.renderer.setOption('showLineNumbers', false);
    }

    function getAllActions(){
      RulesService.all().then(function(response){
        self.allAcitons = response.data.data;
      });
    }

    function addLinksToActions(text){

      //load first all the actions but do it once
      if(self.allAcitons == null){
        return;
      }

      var matches = text.match(/\(.*?\)/g);

      if(matches != null && matches.length > 0) {
        matches.map(function (str) {

          try {
            var entities = str.replace('(', '').replace(')', '').split('/');
            var objectName = entities[0];
            var actionDetails = entities[1].split(':');
            var actionName = actionDetails[0];
            var actionLine = actionDetails[1];

            if (self.action.name === actionName)
              return;

            var objectId = TablesService.getTableByName(objectName).__metadata.id;

            var actionId = _.findWhere(self.allAcitons, {name: actionName, viewTable: objectId}).iD;

            var uri = "";

            if (objectId == 4) {
              uri = $state.href('security.actions', {actionId: actionId, line: actionLine}, {absolute: true});
            } else {
              uri = $state.href('object_actions', {actionId: actionId,tableId: objectId,line: actionLine}, {absolute: true});
            }

            var newStr = '<a href="' + uri + '" target="_blank">' + str + '</a>';

            text = text.replace(str, newStr);
          }
          catch(e){
            consoel.log(e); //ignore errors just log them
          }

        });
      }

      return text.replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

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
      self.ruleList = data.data.data;
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
              description: 'These actions execute after the object is being created and saved but before commit. The event occurring during the same transaction context',
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
              description: 'These actions execute while the object is being saved but before commit. The event occurring during the same transaction context',
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
              description: 'These actions execute while the object is being deleted but before commit. This event occurring during the same transaction context',
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

      self.dataActionToType = {};

      self.items.forEach(function (type) {
        type.items.forEach(function (item) {
          self.dataActionToType[item.dataAction] = type.title;
        })
      });

      //build the tree
      angular.forEach(self.ruleList, function (value, key) {
        var obj = {name: value.name};
        var da = $filter('filter')($scope.modal.dataActions, function (f) {
          return f.value === value.dataAction;
        })[0];
        if (da) {
          self.items[da.level1].items[da.level2].visible = true;
          self.items[da.level1].items[da.level2].items.push(obj);
        }
      });

      if ($stateParams.actionId) {
        var action = _.filter(self.ruleList, function (rule) {
          return rule.__metadata.id === $stateParams.actionId;
        })[0];
        if (action) {
          self.showAction(action.name);
        }
      }
    }

    self.getDataActionType = function () {
      if (self.action){
        return self.dataActionToType[self.action.dataAction];
      }
    };

    function setTestActionTitle() {
      var text = "Test Action";

      if (self.action) {
        var dataActionType = self.getDataActionType();
        text = "Test " + dataActionType;
        text += dataActionType === 'On Demand' ? " Action" : " Trigger";
      }

      // Reset test URL & http when changing actions
      self.testUrl = '';
      self.testHttp = '';

      self.testActionTitle = text;
    }

    self.copyResult = {
      getUrl: getResultUrl,
      getInputForm: getInputParametersForm,
      getTestForm: getRuleForm
    };

    self.copyUrlParams = {
      getUrl: getTestUrl,
      getInputForm: getInputParametersForm,
      getTestForm: getRuleForm
    };

    self.copyHttpParams = {
      getUrl: getTestHttp,
      getInputForm: getInputParametersForm,
      getTestForm: getRuleForm
    };

    self.getCliActionName = function () {
      if (self.action.name){
        return '--action ' + self.action.name;
      }
      return '';
    }

    self.appName = AppsService.currentApp.Name;
    self.getStorageUrl = function () {
      if (self.action && self.action.name)
        return CONSTS.nodejsUrl + '/' + self.appName + '/' + getTableName() + '/' + self.action.name;
      return '';

    };

    self.refresh = function () {
      ConfirmationPopup.confirm('Are you sure you want to reload? Unsaved changes will be discarded.')
        .then(function (result) {
          if (result) {
            usSpinnerService.spin('loading');
            self.isNewAction = false;
            refreshAction(self.action);
            init();
          }
        });
    };

    function getInputParametersForm() {
      return self.inputParametersForm;
    }

    function getRuleForm() {
      return self.newRuleForm;
    }

    function getTestUrl() {
      // return the test url for display WITHOUT DEBUG PARAM
      // If the parameters object is empty it omits the object from the url
      return decodeURIComponent(self.testUrl.replace('%22$$debug$$%22:true', ''));//.replace(/&parameters.*%7D/, '');
    }

    function getTestHttp() {
      // return the test $http for display WITHOUT DEBUG PARAM
      // If the parameters object is empty it omits the object from the $http example
      return self.testHttp.replace('%22$$debug$$%22:true', '').replace(/&parameters.*%7D/, '');
    }

    function getResultUrl() {
      return self.test.result;
    }

    self.namePattern = /^\w+[\w ]*$/;
    // list of parameters:
    // each parameter starts with letter or '_' and may contain also numbers
    // the list should start and end with parameters, delimited by ',', allowing spaces (not within a parameter)
    self.paramsPattern = /^\s*(?:(?:[A-Za-z_]\w*)(?:\s*,\s*)?)*$/;
    self.codePattern = /\s*function\s+backandCallback\s*\(\s*userInput\s*,\s*dbRow\s*,\s*parameters\s*,\s*userProfile\s*\)\s*{(.|[\r\n])*}\s*$/;

    var backandCallbackConstCode = {
      start: '/* globals\n\  $http - Service for AJAX calls \n' +
      '  CONSTS - CONSTS.apiUrl for Backands API URL\n' +
      '  Config - Global Configuration\n' +
      '  socket - Send realtime database communication\n' +
      '  files - file handler, performs upload and delete of files\n' +
      '  request - the current http request\n' +
      '\*/\n' +
      '\'use strict\';\n' +
      'function backandCallback(userInput, dbRow, parameters, userProfile) {',
      end: '}'
    };

    /**
     * delegate errors to the notification service
     * @param error
     * @param message
     */
    function errorHandler(error, message) {
      NotificationService.add('error', message);
      self.test.testLoading = false;
    }


    init();
  }
}());

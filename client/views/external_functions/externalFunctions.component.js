/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.externalFunctions
 * @module backand.externalFunctions
 *
 * @description
 * a main Component
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand.externalFunctions')
    .directive('externalFunctions', [function () {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'views/external_functions/externalFunctions.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          'usSpinnerService',
          '$modal',
          '$state',
          'modalService',
          '$rootScope',
          'APP_CONSTS',
          'AppsService',
          'ConfirmationPopup',
          function ($log, usSpinnerService, $modal, $state, modalService, $rootScope, APP_CONSTS, AppsService, ConfirmationPopup) {
            $log.info('Component externalFunctions has initialized');
            var $ctrl = this;
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            $ctrl.onSaveConnection = onSaveConnection;
            $ctrl.onLoadConnection = onLoadConnection;
            $ctrl.onLoadLambdaFunctions = onLoadLambdaFunctions;
            $ctrl.isNew = isNew;
            $ctrl.editConnection = false;
            $ctrl.addNewProvider = addNewProvider;
            /**
             * public properties
             */
            $ctrl.activeConnection = {};
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              // options to <users> Component
              $ctrl.options = {
                view: 'launcher',
                source: $state.params.source,
                title: 'Registered Users'
              };
              $ctrl.appName = $state.params.appName;
              $ctrl.appConst = APP_CONSTS;
              //set first tab as activeTab
              $ctrl.activeTab = 0;
              //set collapsible panels
              $ctrl.sections = {
                awsConnection: true,
                lambdaFunctions: true
              };
              getApp();
              //opens modal for AWS credentials
              if (isNew()) {
                providerModal();
              }
              setCurrentAppTokens();
              usSpinnerService.stop('loading');
            }

            /**
             * @name getLambdaFunctions
             * @description An helper function which $emit an event to notifify `lambdaFunctions` Component
             * @see `lambdaFunctions` Component
             */
            function getLambdaFunctions() {
              /**
              * @event EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS
              * @param activeConnection
              * @see awsConnection Component
              */
              $rootScope.$emit('EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS', {
                activeConnection: $ctrl.activeConnection
              });
              $log.info('$emit EVENT:EXTERNAL_FUNCTION:LOAD_LAMBDA_FUNCTIONS', $ctrl.activeConnection);
            }

            /**
             * @name onLoadLambdaFunctions
             * @description A callback handler which is called when lambda functions are loaded in `lambdaFunctions` Component
             * 
             * @param {array} A list of lambda functions
             * @param {boolean} hasFunctions
             * @see `lambdaFunctions` Component
             */
            function onLoadLambdaFunctions(functions, hasFunctions) {
              $log.info('onLoadLambdaFunctions is called with -', functions, hasFunctions);
              if (hasFunctions) {
                $ctrl.sections.lambdaFunctions = false;
              }
            }

            /**
            * @name onSaveConnection
            * @description  function is called when AWS connection is saved/updated
            * Fetch new lambda functions 
            * 
            * @param {object} connection An object of connection details
            * @returns void
            */
            function onSaveConnection(connection, status) {
              $log.info('onSaveConnection - AWS connection is updated with -', connection, status);
              $ctrl.editConnection = status ? false : true;
            }

            /**
             * @name providerModal
             * @description opens modal/popup to configure AWS credentials
             * 
             * @returns void
             */
            function providerModal() {
              var stateParams = $state.params;
              angular.extend(stateParams, {
                new: undefined
              });

              modalService
                .cloudProvider()
                .then(function (data) {
                  $log.info('connection with - ', data);
                  $state.transitionTo($state.current.name, stateParams, {
                    reload: true
                  });
                }, function () {
                  $log.info('Cancelled AWS credentials to enter.');
                  //msg, okText, cancelText, showOk, showCancel, title, size
                  ConfirmationPopup.confirm('<p>Connect your AWS account to easily launch Lambda functions.In the meantime, see a demo of the tool in action with example functions.</p> <p class="m-b-0"><a href = "https://lambda.backand.io/#/lambdademo/functions?t=OGQ5ZGFlYTgtMzQzMi00NWMxLTk3MGItOGVhODE4MGZmMTBk" class="btn btn-success" target="_blank">See Live Demo</a></p>', 'Close', '', true, false, '', 'md')
                    .then(function (result) {
                      $state.transitionTo($state.current.name, stateParams, {
                        notify: false
                      });
                    })
                });
            }

            /**
             * @name isLauncher
             * @description check if current state has `new` param with valid value [1]
             * 
             * @returns boolean
             */
            function isNew() {
              var newApp = $state.params.new;
              return (typeof newApp !== 'undefined') && (newApp == 1);
            }

            /**
             * @name onLoadConnection
             * @description A handler which is called when connects are loaded from API
             * 
             * @see awsConnection
             * @file aws_connection.directive.js
             * 
             * @param {object} activeConnection 
             */
            function onLoadConnection(activeConnection) {
              angular.extend($ctrl.activeConnection, activeConnection);
              //Expand AWS connection panel if there is no active connection
              $ctrl.sections.awsConnection = !$ctrl.activeConnection.Id ? false : true;
              $ctrl.editConnection = !$ctrl.activeConnection.Id ? true : false;
              getLambdaFunctions();
            }
            function getApp() {
              AppsService
                .getApp($ctrl.appName)
                .then(function (response) {
                  $log.info('getApp', response);
                  $ctrl.isAnonymous = _.get(response, 'settings.secureLevel') == "AllUsers";
                });
            }
            function setCurrentAppTokens() {
              AppsService.appKeys($ctrl.appName).then(function (response) {
                $ctrl.tokens = response.data;
                $log.info('Current App', response.data);

                if ($ctrl.tokens.anonymous) {
                  $ctrl.launcherAppUrl = $ctrl.appConst.LAUNCHER_APP_URL + '/#/' + $ctrl.appName + '/functions?t=' + $base64.encode($ctrl.tokens.anonymous);
                } else {
                  $ctrl.launcherAppUrl = $ctrl.appConst.LAUNCHER_APP_URL + '/#/' + $ctrl.appName + '/login';
                }

              }, function (err) {
                $log.error('Error while setting up current APP', err);
              });
            }

            /**
             * @function
             * @name addNewProvider
             * @description trgger event to launch addNewProvider
             * @see newProvider Component
             */
            function addNewProvider() {
              $rootScope.$emit('EVENT:ADD_PROVIDER');
            }

            //end of controller
          }]
      };
    }]);
})();

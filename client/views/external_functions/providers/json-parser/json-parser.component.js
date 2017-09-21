/**
 * @ngdoc directive
 * @name backand.externalFunctions.directive.jsonParser
 * @module backand.externalFunctions
 *
 * @description
 * manage AWS connection
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';
  angular
    .module('backand.externalFunctions')
    .directive('jsonParser', [function () {
      return {
        restrict: 'E',
        scope: {
          provider: '=',
          onJsonParsed: '&'
        },
        templateUrl: 'views/external_functions/providers/json-parser/json-parser.html',
        controllerAs: '$ctrl',
        bindToController: true,
        controller: [
          '$log',
          '$scope',
          function ($log, $scope) {
            $log.info('Component awsConnection has initialized');
            var $ctrl = this,
              jsonMapping = {
                gcp: {
                  "private_key": "EncryptedPrivateKey",
                  "client_email": "ClientEmail",
                  "project_id": "ProjectName"
                },
                azure: {
                  "subscription_id": "subscriptionId",
                  "app_id": "appId",
                  "tenant": "tenant",
                  "password": "password",
                  "description": "description"
                },
                aws: {
                  "encrypted_secret_access_key": "EncryptedSecretAccessKey",
                  "access_key_id": "AccessKeyId",
                  "description": "description"
                },
                ibm: {
                  "encrypted_secret_access_key": "EncryptedSecretAccessKey",
                  "access_key_id": "AccessKeyId",
                  "description": "description"
                }
              };
            /**
            * call initialization to initialize controllers properties 
            */
            initialization();

            /**
             *
             * public methods
             */
            $ctrl.onfileSelect = onfileSelect;
            $ctrl.extractProviderInfo = extractProviderInfo;
            /**
             * public properties
             */
            $ctrl.jsonContent = '';
            /**
             * @name initialization
             * @description
             * function to initialize properties and call function at very first.
             */
            function initialization() {
              $ctrl.jsonContent = '';
              $ctrl.showForm = false;
              $log.info('jsonParser component');
              $log.info('Selected provider', $ctrl.provider.key);
            }

            function onfileSelect($files) {
              $log.info($files);
              if ($files && $files.length > 0) {
                var reader = new FileReader();
                reader.onload = function () {
                  var text = reader.result;
                  $log.warn('reader - file content', text);
                  extractProviderInfo(text);
                };
                reader.readAsText($files[0]);
              }
            }
            function isJSON(str) {
              try {
                return (JSON.parse(str) && !!str);
              } catch (e) {
                return false;
              }
            }
            function extractProviderInfo(content) {
              var ob, pMap, dMap = {};

              ob = isJSON(content) ? ob = JSON.parse(content, true) : {};  

              pMap = jsonMapping[$ctrl.provider.key];
              for (var skey in pMap) {
                if (pMap.hasOwnProperty(skey)) {
                  var dkey = pMap[skey];
                  dMap[dkey] = ob[skey] || '';
                }
              }

              if (typeof $ctrl.onJsonParsed === 'function') {
                $ctrl.onJsonParsed({
                  credentials: dMap
                });
              }
              $log.info('json content- ', ob, pMap);
              $log.info('Destination map - ', dMap);
            }

            $scope.$watch(function () {
              return $ctrl.provider;
            }, function (n, o) {
              if (angular.equals(n, o)) {
                return;
              }
              initialization();
            });
            //end of controller
          }]
      };
    }]);
})();

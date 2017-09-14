/**
 * @ngdoc service
 * @name backand.externalFunctions.service.ProviderService
 * @module backand.externalFunctions
 *
 * @description
 * ProviderService
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('backand.externalFunctions')
    .service('ProviderService', [function () {
      var self = this,
        appTokens = {},
        models = {
          aws: {
            AccessKeyId: '',
            AwsRegion: [],
            Name: 'Aws',
            CloudVendor: 'AWS',
            EncryptedSecretAccessKey: '',
            Id: '',
            description: ''
          },
          ibm: {
            AccessKeyId: '',
            AwsRegion: [],
            Name: 'Ibm',
            CloudVendor: 'IBM',
            EncryptedSecretAccessKey: '',
            Id: ''
          },
          google: {
            AccessKeyId: '',
            AwsRegion: [],
            accountId: '',
            Name: 'Google',
            CloudVendor: 'Google',
            EncryptedSecretAccessKey: '',
            Id: ''
          },
          azure: {
            AccessKeyId: '',
            AwsRegion: '',
            CloudVendor: 'Azure',
            EncryptedSecretAccessKey: '',
            Name: 'Azure',
            subscriptionId: '',
            appId: '',
            tenant: '',
            password: '',
            description: '',
            Id: ''
          }
        };

      /**
       * Exposed bindable methods
       */
      self.getProviders = getProviders;
      self.getModel = getModel;
      self.prepareRequest = prepareRequest;
      self.setTokens = setTokens;
      self.getTokens = getTokens;
      /**
       * @description 
       * @returns 
       */
      function getProviders() {
        var providers = [{
          name: 'AWS',
          key: 'aws',
          description: 'AWS Lambda',
          enable: true
        }, {
          name: 'Azure',
          key: 'azure',
          description: 'Azure Functions',
          enable: true
        }, {
          name: 'Google',
          key: 'google',
          description: 'Google Functions',
          enable: false
        }, {
          name: 'IBM',
          key: 'ibm',
          description: 'IBM OpenWisk',
          enable: false
        }];
        return providers;
      }

      /**
       * @description 
       * @param {any} pType 
       */
      function getModel(pType) {
        console.log(models[pType]);
        return models[pType];
      }

      /**
       * @function
       * @name prepareRequest
       * @description an helper function to prepare request payload based on model
       * @param {any} provider 
       * @param {any} requestData 
       * @returns 
       */
      function prepareRequest(provider, requestData) {
        var modelProperties = _.keys(getModel(provider.toLowerCase()));
        var request = _.chain(requestData)
          .pick(modelProperties)
          .value();
        return request;
      }
      /**
       * @function
       * @name setTokens
       * @description an helper function to set app tokens in service
       * @param {any} tokens 
       */
      function setTokens(tokens) {
        angular.extend(appTokens, tokens);
      }

      /**
      * @function
      * @name getTokens
      * @description an helper function to get app tokens
      * @returns
      */
      function getTokens() {
        return appTokens;
      }
      //end of service  
    }]);
})();
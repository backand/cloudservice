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
        models = {
          aws: {
            AccessKeyId: '',
            AwsRegion: [],
            accountId: '',
            Name: 'Aws',
            CloudVendor: 'AWS',
            EncryptedSecretAccessKey: ''
          },
          ibm: {
            AccessKeyId: '',
            AwsRegion: [],
            accountId: '',
            Name: 'Ibm',
            CloudVendor: 'IBM',
            EncryptedSecretAccessKey: ''
          },
          google: {
            AccessKeyId: '',
            AwsRegion: [],
            accountId: '',
            Name: 'Google',
            CloudVendor: 'Google',
            EncryptedSecretAccessKey: ''
          },
          azure: {
            appId: '',
            subscriptionId: '',
            Name: 'Azure',
            CloudVendor: 'Azure',
            tenant: '',
            password: ''
          }
        };

      /**
       * Exposed bindable methods
       */
      self.getProviders = getProviders;
      self.getModel = getModel;
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
        return models[pType];
      }
      //end of service  
    }]);
})();
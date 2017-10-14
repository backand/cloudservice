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
        psType = '',
        models = {
          /**
           * function provider's model
           */
          function: {
            aws: {
              AccessKeyId: '',
              AwsRegion: [],
              Name: 'Aws',
              CloudVendor: 'AWS',
              EncryptedSecretAccessKey: '',
              id: '',
              description: ''
            },
            ibm: {
              AccessKeyId: '',
              AwsRegion: [],
              Name: 'Ibm',
              CloudVendor: 'IBM',
              EncryptedSecretAccessKey: '',
              id: ''
            },
            gcp: {
              AwsRegion: [],
              Name: 'GCP',
              CloudVendor: 'GCP',
              id: '',
              EncryptedPrivateKey: '',
              ClientEmail: '',
              ProjectName: ''
            },
            azure: {
              AwsRegion: [],
              CloudVendor: 'Azure',
              Name: 'Azure',
              subscriptionId: '',
              appId: '',
              tenant: '',
              password: '',
              description: '',
              id: ''
            },
            fnproject: {
              AwsRegion: [],
              CloudVendor: 'fnproject',
              Name: 'fnProject',
              connectionString: '',
              gateway: '',
              id: ''
            }
          },
          /**
          * storage provider's model
          */
          storage: {
            aws: {
              AccessKeyId: '',
              AwsRegion: [],
              Name: 'Aws Storage',
              CloudVendor: 'AWS',
              EncryptedSecretAccessKey: '',
              id: '',
              description: ''
            },
            ibm: {
              AccessKeyId: '',
              AwsRegion: [],
              Name: 'IBM Storage',
              CloudVendor: 'IBM',
              EncryptedSecretAccessKey: '',
              id: ''
            },
            gcp: {
              AwsRegion: [],
              Name: 'GCP Storage',
              CloudVendor: 'GCP',
              id: '',
              EncryptedPrivateKey: '',
              ClientEmail: '',
              ProjectName: ''
            },
            azure: {
              AwsRegion: '',
              CloudVendor: 'Azure',
              Name: 'Azure Storage',
              subscriptionId: '',
              appId: '',
              tenant: '',
              password: '',
              description: '',
              id: ''
            }
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
      self.setPsType = setPsType;
      self.getPsType = getPsType;
      self.isPsType = isPsType;
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
          name: 'GCP',
          key: 'gcp',
          description: 'Google Functions',
          enable: true
        }, {
          name: 'IBM',
          key: 'ibm',
          description: 'IBM OpenWisk',
          enable: false
        }, {
          name: 'FnProject',
          key: 'fnproject',
          description: 'Oracle fn Project',
          enable: true
        }];
        return providers;
      }

      /**
       * @description 
       * @param {any} pType 
       */
      function getModel(pType) {
        if (!psType) {
          throw Error('Provider Service Type is not set in service. Please set one of these [function | storage]')
        }
        return models[psType][pType];
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
      /**
      * @function
      * @name setPsType - Provider service Type (storage, function)
      * @description store psType in service
      * @param {any} p 
      */
      function setPsType(p) {
        psType = p;
      }
      /**
      * @function
      * @name setPsType - Provider service Type (storage, function)
      * @description store psType in service
      * @param {any} p 
      */
      function getPsType() {
        return psType ? psType.toLowerCase() : '';
      }

      /**
       * @function
       * @name isPsType
       * @description check for Provider Service type
       * @param {any} types 
       * @returns {boolean}
       */
      function isPsType(types) {
        if (typeof types === 'string') {
          return types.toLocaleLowerCase() === getPsType();
        } else if (_.isArray(types)) {
          var ts = _.map(types, function (t) {
            return typeof t === 'string' ? psType.toLowerCase() : psType
          });
          return _.indexOf(ts, getPsType()) >= 0;
        } else {
          return types === getPsType();
        }
      }
      //end of service  
    }]);
})();
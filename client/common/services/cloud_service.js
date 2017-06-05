/**
 * @ngdoc service
 * @name common.services.cloud
 * @module common.services
 *
 * @description
 * A service to interact with cloud service APIs
 * @requires $http
 * 
 * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */
(function () {
  'use strict';

  angular
    .module('common.services')
    .service('CloudService', ['$http', 'CONSTS', 'AppsService','$q', function ($http, CONSTS, AppsService, $q) {
      var self = this;

      /**
       * Exposed bindable methods
       */
      self.saveAwsConnection = saveAwsConnection;
      self.getAwsConnection = getAwsConnection;
      self.getLambdaFunctions = getLambdaFunctions;
      self.loadAwsRegion = loadAwsRegion;
      self.updateFunction = updateFunction;

      /**
       * Exposed bindable properties
       */
      self.appName = AppsService.currentApp.Name;


      function loadAwsRegion() {
        var awsRegions = {
          "data": [
            {
              "Code": "us-east-1",
              "Name": "US East (N. Virginia)"
            },
            {
              "Code": "us-east-2",
              "Name": "US East (Ohio)"
            },
            {
              "Code": "us-west-1",
              "Name": "US West (N. California)"
            },
            {
              "Code": "us-west-2",
              "Name": "US West (Oregon)"
            },
            {
              "Code": "ca-central-1",
              "Name": "Canada (Central)"
            },
            {
              "Code": "eu-west-1",
              "Name": "EU (Ireland)"
            },
            {
              "Code": "eu-central-1",
              "Name": "EU (Frankfurt)"
            },
            {
              "Code": "eu-west-2",
              "Name": "EU (London)"
            },
            {
              "Code": "ap-northeast-1",
              "Name": "Asia Pacific (Tokyo)"
            },
            {
              "Code": "ap-northeast-2",
              "Name": "Asia Pacific (Seoul)"
            },
            {
              "Code": "ap-southeast-1",
              "Name": "Asia Pacific (Singapore)"
            },
            {
              "Code": "ap-southeast-2",
              "Name": "Asia Pacific (Sydney)"
            },
            {
              "Code": "ap-south-1",
              "Name": "Asia Pacific (Mumbai)"
            },
            {
              "Code": "sa-east-1",
              "Name": "South America (São Paulo)"
            }
          ]
        };

        var defer = $q.defer();
        defer.resolve(awsRegions);
        return defer.promise;
      }
      /**
       * @name getAwsConnection
       * @description get connection details by user
       * 
       * @param {object} params Addtional Query parameters
       * @returns promise
       */
      function getAwsConnection(params) {
        params = params || {};
        return $http({
          method: 'GET',
          url: CONSTS.appUrl + '/1/objects/cloudServiceProvider',
          params: params,
          headers: setHeaders()
        });
      }

      /**
       * @name saveAwsConnection
       * @description save aws connection credentials
       * 
       * @param {object} params Addtional Query parameters
       * @returns promise
       */
      function saveAwsConnection(data, params) {
        var id;
        params = params || {};
        id = data.id || '';
        return $http({
          method: id ? 'PUT' : 'POST',
          url: CONSTS.appUrl + '/1/objects/cloudServiceProvider' + (id ? '/' + id : ''),
          data: data,
          params: params,
          headers: setHeaders()
        });
      }

      /**
       * @name getLambdaFunctions
       * @description get all available lambda functions of current user
       * 
       * @param {object} params Addtional Query parameters
       * @returns promise
       */
      function getLambdaFunctions(params) {
        params = params || {};
        return $http({
          method: 'GET',
          url: CONSTS.appUrl + '/1/lambda',
          params: params,
          headers: setHeaders()
        });
      }

      function setHeaders() {
        return { 'AppName': self.appName };
      }


      /**
       * @name updateFunction
       * @public
       * @description link/unlink function
       * 1. link/select function
       * Request body {
       *    select : true
       * }
       * 
       * 2. unlink/unselect function
       * Request body {
       *    select : false
       * }
       * 
       * @param {object} data A request body to be posted to API
       * @param {obejct} params Addtional parameters to be send in Query params
       * @returns 
       */
      function updateFunction(data, params) {
        params = params || {};
        return $http({
          method: 'POST',
          url: CONSTS.appUrl + '/1/lambda/select',
          data: [data],
          params: params,
          headers: setHeaders()
        });
      }

      //end of service  
    }]);


})();
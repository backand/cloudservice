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
    .service('CloudService', ['$http', 'CONSTS', 'AppsService', function ($http, CONSTS, AppsService) {
      var self = this;

      /**
       * Exposed bindable methods
       */
      self.saveAwsConnection = saveAwsConnection;
      self.getAwsConnection = getAwsConnection;
      self.getLambdaFunctions = getLambdaFunctions;
      self.loadAwsRegion = loadAwsRegion;

      /**
       * Exposed bindable properties
       */
      self.appName = AppsService.currentApp.Name;


      function loadAwsRegion() {
        return $http({
          method: 'GET',
          url: 'common/aws_regions.json'
        });
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

      //end of service  
    }]);


})();
(function () {
  'use strict';
  angular.module('common.services')
    .service('AngularGeneratorService', ['stringifyHttp', AngularGeneratorService]);
  function AngularGeneratorService(stringifyHttp) {
    var self = this;

    self.generateCode = function (httpObject, opts) {
      // console.log(httpObject);
      httpObject = angular.fromJson(httpObject);

      return stringifyHttp(httpObject);
    }
  }
}());

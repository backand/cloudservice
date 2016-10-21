(function () {
  'use strict';
  angular.module('common.services')
    .service('AngularGeneratorService', ['stringifyHttp', AngularGeneratorService]);
  function AngularGeneratorService(stringifyHttp) {
    var self = this;

    self.generateCode = function (opts) {
      var http = opts;
      return stringifyHttp(http);
    }
  }
}());

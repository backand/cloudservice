(function  () {
    'use strict';
  angular.module('app.playground')
    .controller('Playground',["$scope",'SessionService',Playground]);

  function Playground($scope,SessionService){
    var self = this;

    var token = SessionService.getToken();

  }
}());

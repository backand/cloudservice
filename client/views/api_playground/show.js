(function  () {
    'use strict';
  angular.module('app.playground')
    .controller('Playground',["$scope",'SessionService','$state',Playground]);

  function Playground($scope,SessionService,$state){
    var self = this;

    var token = SessionService.getToken();

    var appName = $state.params.name;

  }
}());

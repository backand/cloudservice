
(function  () {
    'use strict';
  angular.module('controllers')
    .controller('NavCtrl',['$rootScope','$scope','$state',NavCtrl]);

  function NavCtrl($rootScope,$scope,$state){
    var self = this;


    this.appName = $state.params.name;

    $scope.$on('$stateChangeSuccess', function(){
      self.state = $state.current.name;
      self.appName = $state.params.name;
    })

  }
}());

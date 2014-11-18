
(function  () {

  function HeaderController($scope,$rootScope,AppsService,$state) {
    that = this;
    $scope.$on('$stateChangeSuccess', function(){
      that.currentState = $state.current.name;
      console.log(that.currentState);
    })
    this.apps = function(){
      return AppsService.getAllApps();
    }

    this.redirectTo = function(appName){
      $state.go('apps.show',{ name: appName });
    }

  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope",'$rootScope','AppsService','$state',HeaderController]);

}());


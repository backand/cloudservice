
(function  () {

  function HeaderController($scope,$rootScope,AppsService,$state) {
    that = this;
    $scope.$on('$stateChangeSuccess', function(){
      that.currentState = $state.current.name;
      that.currentName = $state.params.name;
      console.log(that.currentState);
    })
    this.apps = function(){
      return AppsService.getAppsNames();
    }

    this.redirectTo = function(appName){
      $state.go('apps.show',{ name: appName });
    };

    this.currentName = $state.params.name;


  }

  angular.module('controllers')
    .controller('HeaderController',
    ["$scope",'$rootScope','AppsService','$state',HeaderController]);

}());


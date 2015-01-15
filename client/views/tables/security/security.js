(function () {

  function SecurityController($scope,$state,SecurityMatrixService,NotificationService) {

    var self = this;

    (function init() {
      self.sTemplate = [];
      $scope.$on('tabs:security', buildTemplate);
    }());
  $scope.getPermissions = function(){
    var p= SecurityMatrixService.getPermission(self.sTemplate);
  };
    function buildTemplate(){
      self.appName = SecurityMatrixService.appName = $state.params.name;
     var  permissions = {
        allowCreate: "Admin,Developer",
        allowEdit: "Admin,Developer,User",
        allowDelete: "Admin,Developer",
        allowRead: "Admin,Developer,User"
      };
     if(self.sTemplate.length==0)
      SecurityMatrixService.loadMatrix(self.sTemplate,permissions,errorHandler);


    /*  self.sTemplate = [
        {
          title: 'Admin',
          permissions: {
            read: true,
            create: false,
            update: true,
            delete: false
          }
        },

        {
          title: 'User',
          permissions: {
            read: true,
            create: false,
            update: true,
            delete: false
          }
        }
      ]*/
    }
    function errorHandler(error, message) {
      NotificationService.add('error', message);
    }


  }

  angular.module('app')
    .controller('SecurityController',['$scope','$state','SecurityMatrixService','NotificationService', SecurityController] );
}());

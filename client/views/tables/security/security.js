(function () {

  function SecurityController($scope) {

    var self = this;

    (function init() {
      self.sTemplate = [];
      $scope.$on('tabs:security', buildTemplate);
    }());

    function buildTemplate(){



      self.sTemplate = [
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
      ]
    }



  }

  angular.module('app')
    .controller('SecurityController',['$scope', SecurityController] );
}());

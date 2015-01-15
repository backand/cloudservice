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
            write: false,
            edit: true,
            delete: false
          }
        },

        {
          title: 'User',
          permissions: {
            read: true,
            write: false,
            edit: false,
            delete: false
          }
        }
      ]
    }



  }

  angular.module('app')
    .controller('SecurityController',['$scope', SecurityController] );
}());

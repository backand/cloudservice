/**
 * @ngdoc controller
 * @name backand.controller.TeamController
 * @module backand
 *
 * @description
 * Controller to maintain state of Team Page
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */

(function () {
  angular.module('backand')
    .controller('TeamController', ['$state', function ($state) {
      var $ctrl = this;

      $ctrl.options = {
        title : 'Team',
        adminMode : true
      };

    }]);

}());

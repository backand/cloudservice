/**
 * @ngdoc controller
 * @name backand.controller.RegisteredUserController
 * @module backand
 *
 * @description
 * Controller to maintain state of Registered Users Page
 *
  * @author Mohan Singh ( gmail::mslogicmaster@gmail.com, skype :: mohan.singh42 )
 */

(function () {
  angular.module('backand')
    .controller('RegisteredUserController', ['$state', function ($state) {
      var $ctrl = this;
      $ctrl.options = {
        title: 'Registered Users'
      };
    }]);

}());

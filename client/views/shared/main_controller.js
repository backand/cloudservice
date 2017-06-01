(function () {
  'use strict';

  function MainController($scope, $state, LayoutService, ConfirmationPopup) {

    var self = this;

    (function () {
      self.showJumbo = LayoutService.showJumbo();
    }());

    self.hideNav = function () {
      return ($state.current.name == 'apps.index' || $state.current.name == 'apps.parse' && self.showJumbo)
    };

    self.getAppName = function () {
      return $state.params.appName;
    };

    $scope.$on('AppDbReady', function (event, appName) {
      ConfirmationPopup.confirm('You can start by changing the Data Model of your app by choosing on option in the blue bar in the header or in the object tab.' +
      ' Otherwise you can find how to connect Backand to your app under "Docs & API" in the navigation bar.', 'Ok', '', true, false, 'Your app ' + appName + ' is ready!');
    });
  }

  angular.module('backand')
    .controller('MainController', ['$scope', '$state', 'LayoutService', 'ConfirmationPopup',  MainController]);

})();

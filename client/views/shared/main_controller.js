(function () {
  'use strict';

  function MainController($scope, $state, LayoutService, ConfirmationPopup) {

    var self = this;

    self.hideNav = function () {
      return ($state.current.name == 'apps.index' && LayoutService.showJumbo())
    };

    self.getAppName = function () {
      return $state.params.appName;
    };

    $scope.$on('AppDbReady', function (event, appName) {
      ConfirmationPopup.setTitle('Your app ' + appName + ' is ready');
      ConfirmationPopup.confirm('You can start by reviewing the REST API of your model in the Playground page. ' +
      'You can find the page under "Docs & API" in the navigation bar.', 'Ok', '', true, false);
    });
  }

  angular.module('backand')
    .controller('MainController', ['$scope', '$state', 'LayoutService', 'ConfirmationPopup', MainController]);

})();

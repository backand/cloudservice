angular.module('controllers').controller('AppsIndexController', function($scope) {
  $scope.apps = [
    {
      os: 'Android',
      name: 'AutoDesk360'
    },
    {
      os: 'iOS',
      name: 'AutoDesk360'
    },
    {
      os: 'Android',
      name: 'AutoCad'
    }
  ];
});

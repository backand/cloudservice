angular.module('controllers').controller('AppsIndexController', function($scope) {
  $scope.apps = [
    {
      id: '241',
      os: 'Android',
      name: 'AutoDesk360'
    },
    {
      id: '412',
      os: 'iOS',
      name: 'AutoDesk360'
    },
    {
      id: '143',
      os: 'Android',
      name: 'AutoCad'
    }
  ];
});

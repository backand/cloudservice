(function () {
  'use strict';

  angular.module('common.directives')
    .directive('bkndSearch', function () {
      return {
        bindToController: true,
        scope: {
          results: '='
        },
        templateUrl: 'common/directives/search/search.html',
        controller: ['SearchService', 'AppsService', '$scope', '$rootScope', SearchController],
        controllerAs: 'search'
      }
    });

  function SearchController(SearchService, AppsService, $scope, $rootScope) {
    var self = this;
    self.appName = AppsService.currentApp.Name;
    SearchService.appName = self.appName;

    self.search = function (query) {
      SearchService.get(query).then(function (response) {
        console.log(response);
        self.results = response.data;
        $rootScope.$broadcast('searchResults', self.results);
      });
    };

    $scope.$watch(function () {
      return self.query;
    }, function (newVal, oldVal) {
      if (newVal && newVal.length > 1) {
        self.search(newVal);
      }
    });
  }
}());

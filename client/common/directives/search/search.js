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
      self.loading = true;
      SearchService.get(query).then(function (response) {
        self.loading = false;
        console.log(response);
        self.results = response.data;
        $rootScope.$broadcast('searchResults', self.results);
      });
    };

    $scope.$watch(function () {
      return self.query;
    }, function (newVal, oldVal) {
      if (self.isValidQuery()) {
        self.search(newVal);
      } else {
        self.results = {};
      }
    });

    // Returns whether there is any result to the query
    self.isAnyResult = function () {
      return self.results.Action || self.results.Query || self.results.Object;
    };

    self.isValidQuery = function () {
      return self.query && self.query.length > 1;
    }
  }
}());

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
        controller: ['SearchService', 'AppsService', '$scope', '$rootScope', '$state', 'TablesService', SearchController],
        controllerAs: 'search'
      }
    });

  function SearchController(SearchService, AppsService, $scope, $rootScope, $state, TablesService) {
    var self = this;

    self.search = function (query) {
      self.loading = true;
      var appName = AppsService.currentApp.Name;
      SearchService.get(query, appName).then(function (response) {
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

    $rootScope.$on('$stateChangeStart',
      function () {
        clearQueryInput();
      });

    // Returns whether there is any result to the query
    self.isAnyResult = function () {
      return self.results.Action || self.results.Query || self.results.Object;
    };

    self.isValidQuery = function () {
      return self.query && self.query.length > 1;
    };

    self.goToAction = function (action) {
      if (action.objectId == 4) {
        $state.go('security.actions', {actionId: action.id});
      } else {
        $state.go('object_actions', {actionId: action.id, tableId: action.objectId});
      }
    };

    self.goToQuery = function (query) {
      $state.go('dbQueries.query', {queryId: query.id});
    };

    self.goToObject = function (object) {
      $state.go('object_data', {tableId: object.id});
    };

    function clearQueryInput() {
      self.showResultPopover = false;
      self.query = '';
    }
  }
}());

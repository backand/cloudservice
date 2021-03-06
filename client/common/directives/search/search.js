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
        controller: ['SearchService', 'AppsService', '$scope', '$rootScope', '$state', SearchController],
        controllerAs: 'search'
      }
    });

  function SearchController(SearchService, AppsService, $scope, $rootScope, $state) {
    var self = this;

    var timeoutCode;

    self.results = {};

    self.search = function (query) {
      self.loading = true;
      self.results = {};
      var appName = AppsService.currentApp.Name;
      SearchService.get(query, appName).then(function (response) {
        self.loading = false;
        self.results = response.data;
        self.showResultPopover = true;
        $rootScope.$broadcast('searchResults', self.results);
      });
    };

    $scope.$watch(function () {
      return self.query;
    }, function (newVal, oldVal) {
      if(newVal === oldVal)
        return;

      clearTimeout(timeoutCode);

      timeoutCode = setTimeout(function () {

        if (self.isValidQuery()) {
          self.search(newVal);
        } else {
          self.results = {};
        }
      },500);
    });

    $rootScope.$on('$stateChangeStart',
      function () {
        self.clearQueryInput();
      });


    // Returns whether there is any result to the query
    self.isAnyResult = function () {
      return self.results.Action || self.results.Query || self.results.Object;
    };

    self.isValidQuery = function () {
      return self.query && self.query.length > 1;
    };

    self.goToAction = function (action, line, col) {
      if (action.objectId == 4) {
        $state.go('security.actions', {actionId: action.id, line: line, col: col, q: self.query});
      } else {
        $state.go('object_actions', {actionId: action.id, tableId: action.objectId, line: line, col: col, q:self.query});
      }
    };

    self.goToQuery = function (query) {
      $state.go('dbQueries.query', {queryId: query.id});
    };

    self.goToObject = function (object) {
      $state.go('object_data', {tableId: object.id});
    };

    self.clearQueryInput= function() {
      self.showResultPopover = false;
      self.query = '';
    }

    self.found = function(name){
      if(name === "objectName")
        return "Object";

      if(name === "fieldName")
        return "Field";

      return name;

    }
  }
}());

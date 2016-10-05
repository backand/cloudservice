(function () {
  'use strict';

  angular.module('common.directives')
    .directive('bkndSearchResult', function () {
      return {
        scope: {
          categoryData: '=',
          categoryName: '='
        },
        templateUrl: 'common/directives/search/search_result_category.html'
      }
    });

}());

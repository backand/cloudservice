/**
 * Created by nirkaufman on 1/4/15.
 */
(function () {

    function verticalTabsDirective () {
        return {
          scope: false,
          templateUrl: 'views/tables/vertical_tabs.html'
        }
    }

    angular.module('app')
        .directive('verticalTabs', verticalTabsDirective)
}());

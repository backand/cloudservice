.directive('scrollTo', function ($location, $anchorScroll, $log) {
    return {
        // scope: {
        //     tabStructure: '@'
        // },
        link: function(scope, element, attrs) {
          
          element.bind('click', function(event) {

                var location = attrs.scrollTo;
                var old = $location.hash();
                _.each(scope.tabsStyle, function(value, tab) {
                  scope.tabsStyle[tab] = '';
                });              
                scope.tabsStyle[location] = 'selected-tab';
               
                if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
                    scope.$apply();
                }
                $location.hash(location);
                $anchorScroll();
                //reset to old to keep any additional routing logic from kicking in
                $location.hash(old);
          });
        }
    };
});
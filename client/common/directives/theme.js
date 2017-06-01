(function() {
  'use strict';

  angular.module('theme.directives', []).directive('toggleNavCollapsedMin', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var app = $('#app');
          ele.on('click', function(e) {
            if (app.hasClass('nav-collapsed-min')) {
              app.removeClass('nav-collapsed-min');
            } else {
              app.addClass('nav-collapsed-min');
              $rootScope.$broadcast('nav:reset');
            }
            e.preventDefault();
          });
        }
      };
    }
  ])

  .directive('collapseNav', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, ele, attrs, $state) {
          var $a, $aRest, $app, $lists, $listsRest, $nav, $window, Timer, prevWidth, updateClass;
          $window = $(window);
          $lists = ele.find('ul').parent('li');
          $lists.append('');
          $a = $lists.children('a');
          $listsRest = ele.children('li').not($lists);
          $aRest = $listsRest.children('a');
          $app = $('#app');
          $nav = $('#nav-container');
          $a.on('click', function(event) {
            var $parent, $this;
            if ($app.hasClass('nav-collapsed-min') || ($nav.hasClass('nav-horizontal') && $window.width() >= 768)) {
              return false;
            }
            $this = $(this);
            $parent = $this.parent('li');
            var $chevronRight =  $parent.find('.glyphicon-chevron-right');
            $lists.not($parent).removeClass('open').find('ul').slideUp();
            $parent.toggleClass('open').find('ul').stop().slideToggle();

            if(!$parent.hasClass('open') && $parent.find('.active').length !== 0){
              $parent.addClass('active');
            }
            else{
              $parent.removeClass('active');
            }

            if($chevronRight.length !==0){
              $chevronRight.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
            }
            else{
              $parent.find('.glyphicon-chevron-down').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
            }
            event.preventDefault();
          });

          $aRest.on('click', function(event) {
            $lists.removeClass('open').find('ul').slideUp();
          });

          $scope.$on('nav:reset', function(event) {
            $lists.removeClass('open').find('ul').slideUp();
          });
          $scope.$on('toggle-active', function(){
            $lists.removeClass('active');
          });
          Timer = void 0;
          prevWidth = $window.width();

          updateClass = function() {
            var currentWidth;
            currentWidth = $window.width();
            if (currentWidth < 768) {
              $app.removeClass('nav-collapsed-min');
            }
            if (prevWidth < 768 && currentWidth >= 768 && $nav.hasClass('nav-horizontal')) {
              $lists.removeClass('open').find('ul').slideUp();
            }
            return prevWidth = currentWidth;
          };

          $window.resize(function() {
            var t;
            clearTimeout(t);
            return t = setTimeout(updateClass, 300);
          });
        }
      };
    }
  ])

  .directive('highlightActive', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
            var highlightActive, links, path;
            links = $element.find('a');
            path = function() {
              return $location.path();
            };
            highlightActive = function(links, path) {
              path = '#' + path;
              angular.forEach(links, function(link) {
                var $li, $link, href;
                $link = angular.element(link);
                $li = $link.parent('li');
                href = $link.attr('href');
                if ($li.hasClass('active')) {
                  $li.removeClass('active');
                }
                if (path.indexOf(href) === 0) {
                  return $li.addClass('active');
                }
              });
            };
            highlightActive(links, $location.path());
            $scope.$watch(path, function(newVal, oldVal) {
              if (newVal === oldVal) {
                return;
              }
              return highlightActive(links, $location.path());
            });
          }
        ]
      };
    }
  ])

  .directive('toggleOffCanvas', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.on('click', function() {
            $('#app').toggleClass('on-canvas');
          });
        }
      };
    }
  ]);

}).call(this);

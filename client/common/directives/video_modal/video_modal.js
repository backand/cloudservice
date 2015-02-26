(function () {
  /**
   */
  function VideoModalDirective ($modal, $sce) {
    return {
      restrict: 'AE',
      scope: {
        url: '=',
        title: '='
      },
      link: function videoModalLink(scope, element, attrs) {

        element.bind('click', function($event) {
          scope.openModal();
        });

        scope.openModal = function () {

          scope.givenUrl =  $sce.trustAsResourceUrl(scope.url);

          var modalInstance = $modal.open({
            templateUrl: 'common/directives/video_modal/video_modal.html',
            size: 'lg',
            scope: scope
          });

          scope.ok = function () {
            modalInstance.close();
          };

          scope.cancel = function () {
            modalInstance.dismiss('cancel');
          };


        }

      }
    }
  }

  angular.module('app')
    .directive('videoModal', ['$modal','$sce', VideoModalDirective]);
}());

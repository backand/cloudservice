(function () {

  /**
   * register for scope event, locating
   * the element by the provided id, and
   * apply the provided data
   *
   * @returns {Function}
   */
  function insertAtCaretDirective() {
    var watcher = null;
    return {
      scope: {
        elementId: '@insertAtCaret'
      },
      link: function (scope) {

        if(watcher) {
          watcher();
        }
        watcher = scope.$on('insert:placeAtCaret', function (evt, token) {
          $('#' + scope.elementId).insertAtCaret("{{" + token + "}}");
        });
      }
    }
  }

  angular.module('app')
    .directive('insertAtCaret', insertAtCaretDirective);
}());


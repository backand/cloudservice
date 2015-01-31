(function () {

  /**
   * register for scope event, locating
   * the element by the provided id, and
   * apply the provided data
   *
   * @returns {Function}
   */
  function insertAtCaretDirective() {
    var listener = null;
    return {
      scope: {
        onUpdate: '&'
      },
      link: function (scope) {

        if(listener) {listener();}

        listener = scope.$on('insert:placeAtCaret', function (evt, data) {
          $('#' + data[0]).insertAtCaret("{{" + data[1] + "}}");
          scope.onUpdate(data);
        });

      }
    }
  }

  angular.module('app')
    .directive('insertAtCaret', insertAtCaretDirective);

}());


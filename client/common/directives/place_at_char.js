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
          var elementToInsert = $('#' + data[0]);
          elementToInsert.insertAtCaret(data[1]);
          scope.onUpdate(data);
          elementToInsert.trigger('change');
        });

      }
    }
  }

  angular.module('common.directives')
    .directive('insertAtCaret', insertAtCaretDirective);

}());


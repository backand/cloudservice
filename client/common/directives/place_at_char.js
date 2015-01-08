(function () {

  /**
   * register for scope event, locating
   * the element by the provided id, and
   * apply the provided data
   *
   * @returns {Function}
   */
    function insertAtCaretDirective () {
        return function (scope) {
          scope.$on('insert:placeAtCaret', function (evt, data){
            $('#' + data[0]).insertAtCaret("{{" +data[1]+ "}}");
          });
        }
    }

    angular.module('app')
        .directive('insertAtCaret',insertAtCaretDirective);
}());


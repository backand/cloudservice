(function () {

  angular.module('common.directives')
    .directive('baAceDiff', ['$timeout', baAceDiff]);

  function baAceDiff($timeout) {
    return {
      scope: {
        leftEditor: '=?',
        rightEditor: '=?',
        aceDiffOptions: '=?',
        differ: '=?',
        control: '=?'
      },
      link: function ($scope) {

        function initEditor(editor, editorSettings) {

          editor.on('change', function (data) {
            editorSettings.content = editor.getValue();
            _.debounce(function () {
              $scope.$digest();
            }, 350);
          });

          $scope.$on('ace-update', function () {
            if (editorSettings) {
              editor.getSession().setValue(editorSettings.content);
            }
          });
          $scope.aceDiffOptions.onLoad(editor)
        }

        if ($scope.control) {
          $scope.control.gotoLine = function (editor) {
            var lastCursorPosition = editor.getCursorPosition();
            lastCursorPosition.row += 1;

            $timeout(function () {
              editor.focus();
              editor.gotoLine(lastCursorPosition.row, lastCursorPosition.column);
            }, 550);
          };
        }

        angular.element(document).ready(function () {
          $scope.differ = new AceDiff($scope.aceDiffOptions);
          $scope.editors = $scope.differ.getEditors();

          initEditor($scope.editors.left, $scope.aceDiffOptions.left);
          initEditor($scope.editors.right, $scope.aceDiffOptions.right);

          $scope.leftEditor = $scope.editors.left;
          $scope.rightEditor = $scope.editors.right;
        });

      },
      template: '<div id="flex-container" class="ace-diff-container">' +
        '<div id="acediff-left-editor"></div>' +
        '<div id="acediff-gutter"></div>' +
        '<div id="acediff-right-editor"></div>' +
        '</div>'
    }

  }


}());


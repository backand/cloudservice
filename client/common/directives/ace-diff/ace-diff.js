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
        gotoLine: '=?'
      },
      link: function ($scope) {

        function initEditor(editor, editorSettings) {

          editor.on('change', function (data) {
            editorSettings.content = editor.getValue();
            _.debounce(function () {
              $scope.$digest();
            }, 400);
          });

          $scope.$on('ace-update', function () {
            if (editorSettings) {
              editor.getSession().setValue(editorSettings.content);
            }
          });
          $scope.aceDiffOptions.onLoad(editor)
        }

        function gotoLine(gotoLineData) {
          if (gotoLineData && gotoLineData.editor && gotoLineData.position) {
            gotoLineData.editor.focus();
            gotoLineData.editor.gotoLine(gotoLineData.position.row, gotoLineData.position.column);
          }
        }

        $scope.$watch('gotoLine', function () {
          $timeout(gotoLine.bind(this, $scope.gotoLine), 450);
        });

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


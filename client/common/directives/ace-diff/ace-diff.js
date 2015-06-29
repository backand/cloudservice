(function () {

  angular.module('common.directives')
    .directive('baAceDiff', baAceDiff);

  function baAceDiff() {
    return {
      scope: {
        leftEditor: '=?',
        rightEditor: '=?',
        aceDiffOptions: '=?',
        differ: '=?'
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


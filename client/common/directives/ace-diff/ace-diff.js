(function () {

  angular.module('common.directives')
    .directive('baAceDiff', ['$timeout', baAceDiff]);

  function baAceDiff($timeout) {
    return {
      scope: {
        leftContent: '=',
        rightContent: '=',
        leftEditor: '=?',
        rightEditor: '=?',
        aceDiffOptions: '=?',
        differ: '=?',
        control: '=?'
      },
      templateUrl: 'common/directives/ace-diff/ace-diff.html',
      link: function ($scope) {

        $scope.toggleAceFullScreen = function () {
          $scope.aceFullScreen = !$scope.aceFullScreen;
          // fix bug in full screen display
          setTimeout(function() {
            $scope.leftEditor.resize();
            $scope.rightEditor.resize();
          }, 50);
        };

        function initEditor(editor, editorSettings, contentModel) {

          editor.on('change', function (data) {
            $timeout(function () {
              $scope[contentModel] = editor.getValue();
            });
          });

          $scope.$watch(contentModel, function (newVal, oldVal) {
            if (newVal === editor.getSession().getValue()) return;
            if (editorSettings) {
              editor.getSession().setValue($scope[contentModel]);
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

          initEditor($scope.editors.left, $scope.aceDiffOptions.left, 'leftContent');
          initEditor($scope.editors.right, $scope.aceDiffOptions.right, 'rightContent');

          $scope.leftEditor = $scope.editors.left;
          $scope.rightEditor = $scope.editors.right;
        });

      }
    }

  }


}());


/** Tree control implementation with lazy loading
 * Used for file and hosting views
 */
(function () {
  'use strict';

  angular.module('common.directives')
    .directive('bkndTreeControl', function () {
      return {
        replace: true,
        templateUrl: 'common/directives/tree_control/tree_control.html',
        bindToController: true,
        controller: TreeController,
        controllerAs: 'tree'
      };
    });

  function TreeController() {
    var self = this;
    self.data = [{"type": "folder", "name": "f1"}, {"type": "file", "name": "funny.gif"}];
    self.treeOptions = {
      isLeaf: function (node) {
        return node.type !== 'folder';
      },
      nodeChildren: "children",
      dirSelectable: true,
      injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a3",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
      }
    };
  }
}());

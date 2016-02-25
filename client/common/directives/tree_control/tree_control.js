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
        controllerAs: 'tree',
      };
    });

  TreeController.$inject = ['$state', 'HostingService', 'FilesService', 'AppsService', 'NotificationService', 'usSpinnerService', 'CONSTS', '$window'];
  function TreeController($state, HostingService, FilesService, AppsService, NotificationService, usSpinnerService, CONSTS, $window) {
    var self = this;

    if ($state.current.name == 'hosting.files_tree') {
      self.service = 'file';
    } else {
      self.service = 'hosting';
    }

    var app = AppsService.currentApp;
    self.appName = app.Name;
    self.data = [];

    init();

    self.treeOptions = {
      isLeaf: function (node) {
        return node.type !== 'folder';
      },
      nodeChildren: "children",
      dirSelectable: false,
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

    self.onNodeToggle = function (node, expanded) {
      if (expanded && node.type === 'folder' && node.children.length === 0) {
        usSpinnerService.spin('loading');
        if (self.service == 'hosting') {
          HostingService.get(self.appName, node.path).then(function (data) {
            treePathDataSuccess(data, node);
          }, failureHandler);
        } else {
          FilesService.get(self.appName, node.path).then(function (data) {
            treePathDataSuccess(data, node);
          }, failureHandler);
        }
      }
    };

    self.onClick = function (node, selected) {
      $window.open(getBaseUrl() + '/' + self.appName + '/' + node.path);
    };

    self.reset = function () {
      self.data = [];
      init();
    };

    function getBaseUrl () {
      if (self.service == 'hosting') {
        return CONSTS.hostingUrl;
      } else {
        return CONSTS.storageUrl;
      }
    }

    function treePathDataSuccess(data, node) {
      var items = [];
      if(data.data.length >0 && data.data[0].StorageClass) //server side bug that sometime doesn't bring the description
      // in the first item
        items = _.rest(data.data);

      items.forEach(function (item) {
        node.children.push(createTreeItem(item));
      });
      usSpinnerService.stop('loading');
    }

    function initTreeDataSuccess(treeData) {

      var items = [];
      if(treeData.data.length >0 && treeData.data[0].StorageClass) //server side bug that sometime doesn't bring the
      // description in the first item
        items = _.rest(treeData.data);

      items.forEach(function (item) {
        self.data.push(createTreeItem(item));
      });
      self.noFiles = items.length == 0;

      usSpinnerService.stop('loading');
    }

    function createTreeItem(item) {
      var type;
      if (!item.Size) {
        type = "folder";
      } else {
        type = "file";
      }

      // Remove the app name in the beginning of the Key property
      var path = _.rest(item.Key.split('/')).join('/');
      var name = _.last(path.split('/'));
      return {
        "path": path,
        "type": type,
        "name": name,
        "children": []
      };
    }

    function failureHandler(data) {
      usSpinnerService.stop('loading');
      NotificationService.add('error', 'There was an error retrieving your hosting data. Please make sure hosting is configured correctly.');
    }

    function init() {
      usSpinnerService.spin('loading');
      if (self.service == 'hosting') {
        HostingService.get(self.appName).then(initTreeDataSuccess, failureHandler);
      } else {
        FilesService.get(self.appName).then(initTreeDataSuccess, failureHandler);
      }
    }
  }


}());

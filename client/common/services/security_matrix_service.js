/**
 * Created by Yariv on 15/01/2015.
 */
(function () {
  'use strict';
  function SecurityMatrixService(SecurityService) {
    var self = this;
    self.appName = null;

    this.loadMatrix = function (template, permissions, errorHandler) {
      SecurityService.appName = self.appName;
      SecurityService.getRoles()
        .then(function (data) {
          var roles = data.data.data;
          angular.forEach(roles, function (role) {

            template.push(
              {
                title: role.Name,
                permissions: {
                  read: false,
                  create: false,
                  update: false,
                  delete: false
                }
              }
            )
          });

          self.loadPermission(template, permissions, errorHandler);
        }, errorHandler);

    };
    Array.prototype.contains = function (obj) {
      var i = this.length;
      while (i--) {
        if (this[i] === obj) {
          return true;
        }
      }
      return false;
    };

    this.loadPermission = function (template, permissions, errorHandler) {

      var createPermission = permissions.allowCreate.split(',');
      var editPermission = permissions.allowEdit.split(',');
      var deletePermission = permissions.allowDelete.split(',');
      var readPermission = permissions.allowRead.split(',');

      angular.forEach(template, function (role) {
        if (createPermission.contains(role.title)) {
          role.permissions.create = true;
        }
        if (editPermission.contains(role.title)) {
          role.permissions.update = true;
        }
        if (deletePermission.contains(role.title)) {
          role.permissions.delete = true;
        }
        if (readPermission.contains(role.title)) {
          role.permissions.read = true;
        }
      });
      /*angular.forEach(createPermission, function (permission) {
       var role = $filter('filter')(template, function (d) {
       return d.title === permission;
       });
       if (role)
       role.permissions.create = true;
       });
       */

    };
    this.getPermission = function (template) {
      var permissions = {
        allowCreate: '',
        allowEdit: '',
        allowDelete: '',
        allowRead: ''
      };
      var createPermission = [];
      var editPermission = [];
      var deletePermission = [];
      var readPermission = [];

      angular.forEach(template, function (role) {
        if (role.permissions.create) {
          createPermission.push(role.title);
        }
        if (role.permissions.update) {
          editPermission.push(role.title);
        }
        if (role.permissions.delete) {
          deletePermission.push(role.title);
        }
        if (role.permissions.read) {
          readPermission.push(role.title);
        }
      });
      permissions.allowCreate = createPermission.join(',');
      permissions.allowEdit = editPermission.join(',');
      permissions.allowDelete = deletePermission.join(',');
      permissions.allowRead = readPermission.join(',');
      return permissions;
    }
  }

  angular.module('common.services')
    .service('SecurityMatrixService', ['SecurityService', SecurityMatrixService]);
})();

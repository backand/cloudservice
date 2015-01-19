/**
 * Created by Yariv on 15/01/2015.
 */
(function () {
  'use strict';
  function SecurityMatrixService(SecurityService, $q) {

    var self = this;
    self.appName = null;
    self.tempTemplate = [];

    this.loadMatrix = function (permissions) {

      SecurityService.appName = self.appName;

      return SecurityService.getRoles()
        .then(function (data) {

          var roles = data.data.data;

          angular.forEach(roles, function (role) {

            self.tempTemplate.push(
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

          /**
           * Populate of tem template with permissions
           */
          loadPermission(permissions)
          return self.tempTemplate;
        });
    };

    //todo: (yariv) don't change array prototype
    Array.prototype.contains = function (obj) {
      var i = this.length;
      while (i--) {
        if (this[i] === obj) {
          return true;
        }
      }
      return false;
    };

    /**
     *
     * @param permissions
     */
    function loadPermission(permissions) {

      var createPermission = permissions.allowCreate.split(',');
      var editPermission = permissions.allowEdit.split(',');
      var deletePermission = permissions.allowDelete.split(',');
      var readPermission = permissions.allowRead.split(',');

      angular.forEach(self.tempTemplate, function (role) {
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
    };

    self.getPermission = function (template) {

      var createPermission = [];
      var editPermission = [];
      var deletePermission = [];
      var readPermission = [];

      var permissions = {
        allowCreate: '',
        allowEdit: '',
        allowDelete: '',
        allowRead: ''
      };

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
    .service('SecurityMatrixService', ['SecurityService', '$q', SecurityMatrixService]);
})();

/**
 * Created by Yariv on 15/01/2015.
 */
(function () {
  'use strict';
  function SecurityMatrixService($filter, SecurityService) {
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
                  write: false,
                  edit: false,
                  delete: false
                }
              }
            )
          });

          self.loadPermission(template, permissions, errorHandler);
        }, errorHandler);

    }

    this.loadPermission = function (template, permissions, errorHandler) {

      var createPermission = permissions.allowCreate.split(',');
      var editPermission = permissions.allowEdit.split(',');
      var deletePermission = permissions.allowDelete.split(',');
      var readPermission = permissions.allowRead.split(',');

      angular.forEach(createPermission, function (permission) {
        var role = $filter('filter')(template, function (d) {
          return d.title === permission;
        })[0];
        if (role)
          role.permissions.write = true;
      });


      angular.forEach(editPermission, function (permission) {
        var role = $filter('filter')(template, function (d) {
          return d.title === permission;
        })[0];
        if (role)
          role.permissions.edit = true;
      });


      angular.forEach(deletePermission, function (permission) {
        var role = $filter('filter')(template, function (d) {
          return d.title === permission;
        })[0];
        if (role)
          role.permissions.delete = true;
      });


      angular.forEach(readPermission, function (permission) {
        var role = $filter('filter')(template, function (d) {
          return d.title === permission;
        })[0];
        if (role)
          role.permissions.read = true;
      });

    }
  }

  angular.module('common.services')
    .service('SecurityMatrixService', ['$filter', 'SecurityService', SecurityMatrixService]);
})();

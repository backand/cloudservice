(function  () {
  'use strict';
  angular.module('backand')
    .controller('TablesShow', ['$rootScope', '$stateParams', 'NotificationService', 'ColumnsService', TablesShow]);

  function TablesShow($rootScope, $stateParams,NotificationService, ColumnsService) {

    var self = this;

    (function init() {
      self.appName = $stateParams.appName;
    }());

    /**
     * Sync the database into Backand - add all the tables and sync
     */
    self.sync = function () {
      self.syncing = true;
      NotificationService.add('info', 'Sync takes 1-2 minutes');
      ColumnsService.appName = self.appName;
      ColumnsService.sync()
        .then(function (data) {
          self.syncing = false;
          //update messages
          self.messages = [];
          self.messages.push('New tables added: ' + data.data.added);
          self.messages.push('Tables with error:' + (data.data.newTables - data.data.added));

          if (data.data.errors !== '') {

            //data.data.errors = data.data.errors.replace(/\r?\n/g, "%0D%0A");
            NotificationService.add('error', 'Synchronizing tables completed with errors: ' + data.data.errors);
            self.alertClass = 'tables-alert-with-errors';
            self.messages.push('Errors: ' + data.data.errors);
          }
          else {
            NotificationService.add('success', 'Synchronizing tables was completed successfully');
            self.alertClass = '';
          }
          //refresh tables list
          //broadcast to NAV
          $rootScope.$broadcast('fetchTables');
          //need to save once after sync to see the changes
          $rootScope.$broadcast('after:sync');

        }, function (err) {
          self.syncing = false;
          NotificationService.add('error', 'Can not sync tables');
        });
    }
  }
}());

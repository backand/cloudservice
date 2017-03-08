(function (){
	'use strict';
	angular.module('backand')
	  .controller('DbModelController', ['$state', 'AppsService', '$location',
	  									   'NotificationService', 'ColumnsService',
	  									    'usSpinnerService', '$rootScope','$stateParams', DbModelController]);

	  function DbModelController($state, AppsService, $location, NotificationService, ColumnsService,
	  									    usSpinnerService, $rootScope, $stateParams){

      var self = this;
      var currentApp = AppsService.currentApp;
      self.appName = currentApp.Name;
      //directs to the database settings.
      self.showDatabase = function(){
        $location.path('app/'+self.appName+'/database');
      };

		  // Following function copied from show.js, used to sync objects with db.
		  self.sync = function () {
        self.syncing = true;
        NotificationService.add('info', 'Sync takes 1-2 minutes');
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

            if($stateParams.sync)
              $rootScope.$broadcast('AppDbReady', self.appName);

            $rootScope.$broadcast('SyncSuccess');
            usSpinnerService.spin('loading');
            $state.go($state.current, {}, {reload: true}).then(function () {
              usSpinnerService.stop('loading');
            });

          }, function (err) {
            self.syncing = false;
            NotificationService.add('error', 'Cannot sync tables');
          });
        }
	  }

}());
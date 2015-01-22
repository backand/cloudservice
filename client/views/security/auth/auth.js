/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth( $stateParams, NotificationService, SecurityService,AppsService, $scope) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $stateParams.name;
      self.data={settings:{},privateApp:false};
      self.updateAppAuth = updateAppAuth;
     //secureLevel= "RegisteredUsers";
      loadConfigurationData();
    }());

    $scope.$watch('auth',updateAppAuth,true);
    function updateAppAuth(newVal,oldVal,scope)
    {
      if(oldVal.data.settings.__metadata) {
       if(self.data.privateApp)
         self.data.settings.secureLevel ="RegisteredUsers";
        else
         self.data.settings.secureLevel ="AllUsers";

        AppsService.update( self.appName, newVal.data);
      }
    }
    function loadConfigurationData() {
      AppsService.getCurrentApp(self.appName).then(setDbInfo,errorHandler);

      SecurityService.getRoles().then(rolesSuccessHandler, errorHandler);
 }

    function rolesSuccessHandler(data) {
      self.roles = data.data.data;
    }

    function errorHandler(error, message) {
      NotificationService.add('error', message);
     }

    function setDbInfo(data){
      self.data.settings =data.settings;

      self.data.privateApp =self.data.settings.secureLevel =="RegisteredUsers";

    }
  }

  angular.module('app')
    .controller('SecurityAuth', [
     '$stateParams',
      'NotificationService',
      'SecurityService',
      'AppsService',
      '$scope',
      SecurityAuth
    ]);

}());

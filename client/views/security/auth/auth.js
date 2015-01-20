/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityAuth( $stateParams, NotificationService, SecurityService,AppsService, $scope) {

    var self = this;
    (function init() {
      self.appName = SecurityService.appName = AppsService.appName = $stateParams.name;
      self.settings ={
        privateApp:false,
        anonymous:true,
        anonymousRole:"Admin"
      };
     //secureLevel= "RegisteredUsers";
      loadConfigurationData();
    }());

    $scope.$watch("auth.settings", updateAppAuth,true);

    function updateAppAuth(newVal,oldVal,scope)
    {

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
      self.settings.privateApp =data.settings.secureLevel =="RegisteredUsers";
      self.anonymous =true;
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

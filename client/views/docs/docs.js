(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('Docs', ['AppsService', 'usSpinnerService', '$state','SessionService','SecurityService','$rootScope','CONSTS', '$modal', Docs]);

  function Docs(AppsService, usSpinnerService, $state, SessionService, SecurityService, $rootScope, CONSTS, $modal) {

    var self = this;
    self.hostingUrl = CONSTS.hostingUrl;
    self.kickstartTabs = [

      {
        heading: 'Selector',
        route: 'docs.platform_select_kickstart'
      }
    ];

    (function init() {
      usSpinnerService.spin("connecting-app-to-db");
      self.isAppOpened = !_.isEmpty(AppsService.currentApp);
      self.currentApp = AppsService.currentApp;
      if(self.currentApp.DatabaseStatus !== 0 && !_.isEmpty(AppsService.currentApp))
        AppsService.appKeys(self.currentApp.Name).then(setKeysInfo);

      //when creating new app and it is the pool, there is no status 2 so the timer doesn't work and need to trigger
      // this manually
      if($state.params.newApp && self.currentApp.DatabaseStatus == 1){
        $rootScope.$broadcast('AppDbReady', self.currentApp.Name);
      }
    }());

    function setKeysInfo(data){
      self.keys = data.data;
      self.masterToken = data.data.general;
    }

    self.newApp = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/docs/new_app_modal.html',
        controller: 'NewAppModalController',
        controllerAs: 'newAppModal'
      });
    };

    self.goToKickstart = function () {
      $state.go('docs.platform_select_kickstart');
    };

    self.goToQuickstart = function () {
      if (_.isEmpty(AppsService.currentApp)) {
        $state.go('docs.platform_select_kickstart-open');
      }
      else {
        $state.go('docs.platform_select_kickstart');
      }
    };

    self.isNew = function () {
      var isNew = !_.isEmpty(AppsService.currentApp) && AppsService.currentApp.DatabaseStatus == 2;
      if (isNew) {
        usSpinnerService.spin("connecting-app-to-db");
      }
      else {
        usSpinnerService.stop("connecting-app-to-db");
      }
      return isNew;
    };

    self.getTokens = function(){

      //get first admin user token
      SecurityService.appName = self.currentApp.Name;
      SecurityService.getUserToken(SessionService.currentUser.username)
        .then(function (response) {
          self.userToken = response.data;
        });
    }
  }

}());

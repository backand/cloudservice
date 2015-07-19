(function() {
  'use strict';

  angular.module('common.services', ['ngCookies'])
    .service('SessionService', ['CONSTS', '$cookieStore','$analytics', SessionService]);

  function SessionService(CONSTS, $cookieStore,$analytics) {
    var self = this;

    self.currentUser = $cookieStore.get('globals') ? $cookieStore.get('globals').currentUser : undefined;

    self.getAuthHeader = function() {
      return self.currentUser ? 'bearer ' + self.currentUser.access_token : false;
    };

    self.getToken = function() {
      return self.currentUser ? self.currentUser.access_token : false;
    };


    self.setCredentials = function (serverData, username) {
      var user = {
        currentUser: {
          access_token : serverData.access_token,
          username: username || serverData.username,
          userId: serverData.userId
        }
      };

      self.currentUser = user.currentUser;

      $cookieStore.put('globals', user);

      if(window.JacoRecorder)
        window.JacoRecorder.identify(user.currentUser.username);
      //if (woopra)
      //  woopra.identify({ email: user.currentUser.username, id:user.currentUser.username });
      self.track('session',{name: user.currentUser.username})
      if (typeof __insp != 'undefined')
        __insp.push(['identify', user.currentUser.username]);
      /*if($intercom)
        $intercom.boot({
          app_id: CONSTS.IntercomAppId,
          name: user.currentUser.username,
          email: user.currentUser.username,
          created_at: new Date().getTime()
        });*/
    };

    self.ClearCredentials = function () {
      $cookieStore.remove('globals');
      self.currentUser = undefined;
     /* if($intercom)
        $intercom.shutdown();*/
    };

    self.getUserId = function () {
      return (self.currentUser && self.currentUser.userId) ? self.currentUser.userId : 0;
    };

    self.track = function (eventName,eventObject)
    {
      if (analytics)
        analytics.identify(self.currentUser.username, {
          name: self.currentUser.username,
          email: self.currentUser.username,
          createdAt: new Date().getTime()
        });
      $analytics.eventTrack(eventName ,eventObject);
    }
  }

})();

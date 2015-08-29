(function () {
  'use strict';

  angular.module('common.services')
    .service('AnalyticsService', ['$analytics', 'SessionService', AnalyticsService]);

  function AnalyticsService($analytics, SessionService) {

    var self = this;

    self.track = function (eventName, eventObject) {
      if (analytics)
        analytics.identify(SessionService.currentUser.username, {
          name: SessionService.currentUser.username,
          email: SessionService.currentUser.username,
          createdAt: new Date().getTime()
        });
      $analytics.eventTrack(eventName, eventObject);
    };

    self.trackSignupEvent = function(fullName, email, social) {

      var socialName = social ? social.name : 'self';
      analytics.identify(email, {
        name: fullName,
        email: email,
        signed_up_at: new Date().getTime()
      });
      $analytics.eventTrack('SignedUp', {name: fullName});
      $analytics.eventTrack('SocialSignedUp', {provider: socialName});
    };

    self.identify = function (fullName, email) {
      if (analytics) {
        analytics.identify(email, {
          name: fullName,
          email: email,
          createdAt: new Date().getTime()
        });
      }
    };

    self.jacoIdentify = function (username) {
      if(window.JacoRecorder) {
        window.JacoRecorder.identify(username);
      }
    };

    self.woopraIdentify = function (email, id) {
      if (woopra) {
        woopra.identify({email: email, id: id});
      }
    };

    self.inspect = function (username) {
      if (typeof __insp != 'undefined') {
        __insp.push(['identify', username]);
      }
    }
  }

})();

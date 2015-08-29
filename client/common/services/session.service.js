(function() {
  'use strict';

  angular.module('common.services')
    .service('SessionService', ['$cookieStore', '$injector', SessionService]);

  function SessionService($cookieStore, $injector) {

    var self = this;

    var requestedState = {};
    var failedRequests = [];

    self.currentUser = $cookieStore.get('globals') ? $cookieStore.get('globals').currentUser : undefined;

    self.setCredentials = function (currentUser) {
      self.currentUser = currentUser;
      $cookieStore.put('globals', {currentUser: currentUser});
    };

    self.clearCredentials = function () {
      $cookieStore.remove('globals');
      self.currentUser = undefined;
    };

    self.getUserId = function () {
      return (self.currentUser && self.currentUser.userId) ? self.currentUser.userId : 0;
    };

    self.getAuthHeader = function() {
      return self.currentUser && self.currentUser.access_token ? 'bearer ' + self.currentUser.access_token : false;
    };

    self.getToken = function() {
      return self.currentUser ? self.currentUser.access_token : false;
    };

    self.clearToken = function() {
      if (self.currentUser) self.currentUser.access_token = null;
    };


    self.setRequestedState = function (state, params) {
      if (_.isEmpty(requestedState)) {
        requestedState = {
          state: state,
          params: params
        };
      }
    };

    self.getRequestedState = function () {
      var state = requestedState;
      self.clearRequestedState();
      return state;
    };

    self.clearRequestedState = function () {
      requestedState = {};
    };

    self.addFailedRequest = function (request) {
      failedRequests.push(request);
    };

    self.updateFailedRequestsAuth = function (newAuth) {
      failedRequests.forEach(function (request) {
        request.headers.Authorization = newAuth;
      });
    };

    self.rerunFailedRequests = function () {
      var http = $injector.get('$http');
      failedRequests.forEach(function (request) {
        http(request);
      });
      self.clearFailedRequests();
    };

    self.clearFailedRequests = function () {
      failedRequests = [];
    }
  }

})();

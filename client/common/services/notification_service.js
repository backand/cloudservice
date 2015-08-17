(function() {
  'use strict';

  function NotificationService(toaster, $timeout) {

    var self = this;

    function setLastError (type, text) {
      self.lastError = {
        type: type,
        text: text
      };
    }

    function resetError () {
      setLastError(null, null);
    }

    /**
     *
     * @param type String : success, error, info, warning
     * @param text String : toaster text
     */
    self.add = function(type, text) {
      // if the error was already popped, do not pop it again
      if ((type === 'error' || type === 'warning') && _.isEqual(type, self.lastError.type) && _.isEqual(text, self.lastError.text)) return;
      if (!text) return;
      setLastError(type, text);
      toaster.pop(type, "", text);
      $timeout(resetError, 1000);
    };

    resetError();
  }

  angular.module('common.services')
    .service('NotificationService',['toaster', '$timeout', NotificationService]);

})();

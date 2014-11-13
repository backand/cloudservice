(function() {
  'use strict';

  function NotificationService(toaster) {

    /**
     *
     * @param type String : success, error,info,warning
     * @param text String : toaster text
     */
    this.add = function(type,text){
      toaster.pop(type, "", text);
    }


  }

  angular.module('common.services')
    .service('NotificationService',['toaster', NotificationService]);

})();

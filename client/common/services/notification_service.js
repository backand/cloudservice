(function() {
  'use strict';

  function NotificationService(toaster) {


    this.add = function(text){
      toaster.pop('error', "Error", text);
    }


  }

  angular.module('common.services')
    .service('NotificationService',['toaster', NotificationService]);

})();

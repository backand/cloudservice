/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers($stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;
    self.myData = [];

    SecurityService.getUsers($stateParams.name, 20)
      .then(usersSuccsessHandler, errorHandler);

    function usersSuccsessHandler(data) {
      self.myData = data.data.data;
    }

    //this.myData = [
    //  {
    //    "firstName": "Cox",
    //    "lastName": "Carney",
    //    "company": "Enormo",
    //    "employed": true
    //  },
    //  {
    //    "firstName": "Lorraine",
    //    "lastName": "Wise",
    //    "company": "Comveyer",
    //    "employed": false
    //  },
    //  {
    //    "firstName": "Nancy",
    //    "lastName": "Waters",
    //    "company": "Fuelton",
    //    "employed": false
    //  }
    //];

    function errorHandler(error, message) {
      NotificationService.add('error', message);
      $log.debug(error);
    }

  }

  angular.module('app')
    .controller('SecurityUsers', [
      '$stateParams',
      '$log',
      'NotificationService',
      'SecurityService',
      SecurityUsers
    ]);

}());

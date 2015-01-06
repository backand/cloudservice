/**
 * Refactored by nirkaufman on 1/4/15.
 */
(function () {

  function SecurityUsers($stateParams, $log, NotificationService, SecurityService, $scope) {

    var self = this;
    self.myData = [];
    self.gridOptions= {
      data:{},
      columnDefs: [
        { name: 'FirstName' },
        { name: 'LastName' },
        { name: 'Username' },
        { name: 'Email' },
        { name: 'durados_User_Role',displayName:'Role' },
        { name: 'IsApproved' }
      ]
    };
    var columnDefs = [{name:'field1'}, {name:'field2'}];
    SecurityService.getUsers($stateParams.name, 20)
      .then(usersSuccsessHandler, errorHandler);

    function usersSuccsessHandler(data) {
      self.gridOptions.data = data.data.data;
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

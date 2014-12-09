(function() {
  'use strict';

  function DatabaseNamesService() {

    var numbers = {
      2 : 'sqlserver',
      4 : 'mysql',
      6 : 'mongodb',
      7 : 'oracle',
      8 : 'postgresql',
      10 : 'newMysql',
      11 : 'newPostgre',
      12 : 'newDummy'
    };

    var names = {
      'sqlserver' : 2,
      'mysql' : 4,
      'mongodb': 6,
      'oracle': 7,
      'postgresql': 8,
      'newMysql': 10,
      'newPostgre': 11,
      'newDummy': 12
    };

    var database_source = {
        1: 'sqlserver',
        2: 'sqlazure',
        3: 'mysql',
        4: 'postgresql',
        5: 'oracle'
    }

    this.getName = function(dataNumber){
       return numbers[dataNumber];
    };

    this.getNumber = function (dataName){
      return names[dataName];
    };

    this.getDBSource = function (dataName){
      return database_source[dataName];
    };

  }

  angular.module('common.services')
    .service('DatabaseNamesService',[ DatabaseNamesService]);

})();


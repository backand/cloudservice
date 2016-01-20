(function () {
  'use strict';
  angular.module('backand')
    .controller('HostingViewController', ['$scope', HostingViewController]);

  function HostingViewController($scope) {

    var self = this;

    self.name = 'hosting';
  }

}());

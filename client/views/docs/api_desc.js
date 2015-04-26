(function () {
  'use strict';

  angular.module('backand.docs')
    .controller('Desc', ['$scope', '$location', '$anchorScroll', Desc]);

  function Desc($scope, $location, $anchorScroll) {

    var self = this;

    self.scrollTo = function(id){

      $location.hash(id);
      $anchorScroll();
    }

  }

}());

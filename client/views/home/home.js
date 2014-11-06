(function() {
  'use strict';

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function HomeCtrl(data) {
    /*jshint validthis:true */
    var home = this;
    this.data = data.data;
  }

  angular.module('home', [])
    .controller('HomeCtrl', HomeCtrl);
})();

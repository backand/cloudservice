/**
 * Created by itay on 3/19/15.
 */
/**
 * Created by itay on 3/18/15.
 */
(function () {
  'use strict';

  angular.module('app.playground')
    .controller('Docs', ['$state', Docs]);

  function Docs($state) {

    var self = this;

    self.isNew = $state.params.isnew;
  }


}());

/**
 * @ngdoc constant
 * @name common.constants.APP_CONSTS
 * @module common
 *
 * @description
 * Global constants for application
 *
 * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
 */

(function () {
  'use strict';
  angular
    .module('common.constants')
    .constant('APP_CONSTS', {
      EMAIL_REGEX : '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)'
    });
})();
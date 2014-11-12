'use strict';

angular.module('app.apps').controller('AppsShowController',
  ['appItem', function(appItem) {
    this.appUploadState = 'bg-danger';
    this.appConnectedState = "bg-success";
    this.appWarnState ='bg-warning';

    var appData = appItem.data;
    this.appName = appData.Name;
  }
]);

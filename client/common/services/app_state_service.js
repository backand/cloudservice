/**
 * Created by itay herskovits on 16/02/2015.
 */
(function () {

  function AppState() {

    var self= this;
    var _currentApp = null;

    self.get = function(){
      return _currentApp;
    }

    self.set = function(appName){
      _currentApp = appName;
    }

    self.reset = function(){
      _currentApp = null;
    }


  }

  angular.module('app')
    .service('AppState', [AppState]);
}());

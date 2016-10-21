(function () {
  'use strict';

  angular.module('common.directives')
    .directive('bkndCodeGenerator', function () {
      return {
        templateUrl: 'common/directives/code_generator/code_generator.html',
        bindToController: true,
        controller: CodeGeneratorController,
        controllerAs: 'codeGenerator',
        require: 'relativeUrl',
        scope: {
          method: '@?',
          relativeUrl: '@',
          params: '@?',
          data: '@?'
        }
      }
    });

  CodeGeneratorController.$inject = ['$injector', 'CONSTS', 'LocalStorageService', '$scope'];

  function CodeGeneratorController($injector, CONSTS, LocalStorageService, $scope){
    var self = this;

    self.baseUrl = CONSTS.appUrl;

    self.languageOptions = [{
      value: 1,
      label: 'Angular'
    }, {
      value: 2,
      label: 'React (via Fetch)'
    }];

    self.storage = LocalStorageService.getLocalStorage();
    if (!self.storage.favoriteLanguage) {
      self.chosenLanguage = 1;
    } else {
      self.chosenLanguage = self.storage.favoriteLanguage;
    }



    $scope.$watch(function () {
      return self.chosenLanguage;
    }, function (newVal) {
      if (newVal) {
        self.storage.favoriteLanguage = newVal;
      }
    });


  }
}());

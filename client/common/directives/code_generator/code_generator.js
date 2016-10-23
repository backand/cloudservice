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
          url: '@',
          params: '=?',
          data: '=?'
        }
      }
    });

  CodeGeneratorController.$inject = ['CONSTS', 'LocalStorageService', '$scope', 'AngularGeneratorService'];

  function CodeGeneratorController(CONSTS, LocalStorageService, $scope, AngularGeneratorService){
    var self = this;

    self.languageOptions = [{
      value: 1,
      label: 'Angular',
      generator: AngularGeneratorService
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
        if (self.method.toUpperCase() == "POST" || self.method.toUpperCase == "PUT") {
          self.generateCode({method: self.method, url: self.url, params: self.params, data: self.data});
        } else {
          self.generateCode({method: self.method, url: self.url, params: self.params});
        }
      }
    });

    self.generateCode = function (opts) {
      var chosenLanguageOption = _.where(self.languageOptions, {value: self.chosenLanguage})[0];
      self.code = chosenLanguageOption.generator.generateCode(opts);
    };

  }
}());

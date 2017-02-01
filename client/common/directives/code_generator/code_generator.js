(function () {
  'use strict';

  angular.module('common.directives')
    .directive('bkndCodeGenerator', function () {
      return {
        restrict: 'E',
        templateUrl: 'common/directives/code_generator/code_generator.html',
        bindToController: true,
        controller: CodeGeneratorController,
        controllerAs: 'codeGenerator',
        require: 'relativeUrl',
        scope: {
          url: '@',
          httpObject: '@'
        }
      }
    });

  CodeGeneratorController.$inject = ['CONSTS', 'LocalStorageService', '$scope', 'VanillaGeneratorService'];

  function CodeGeneratorController(CONSTS, LocalStorageService, $scope, VanillaGeneratorService){
    var self = this;

    self.languageOptions = [{
      value: 1,
      label: 'Vanilla',
      generator: VanillaGeneratorService,
      opts: {
        type: 'promise',
        es6: false,
        prefix: 'backand',
      }
    }, {
      value: 2,
      label: 'Angular1',
      generator: VanillaGeneratorService,
      opts: {
        type: 'return',
        es6: false,
        prefix: 'Backand',
      }
    }, {
      value: 3,
      label: 'Angular2',
      generator: VanillaGeneratorService,
      opts: {
        type: 'promise',
        es6: true,
        prefix: 'this.backand',
      }
    }];

    self.storage = LocalStorageService.getLocalStorage();
    if (!self.storage.favoriteLanguage) {
      self.chosenLanguage = 1;
    } else {
      self.chosenLanguage = self.storage.favoriteLanguage;
    }

    $scope.$watch(function () {
      return self.httpObject;
    }, function(newVal, oldVal) {
      if (newVal) {
        self.generateCode(self.httpObject);
      }
    });

    $scope.$watch(function () {
      return self.chosenLanguage;
    }, function (newVal) {
      if (newVal) {
        self.storage.favoriteLanguage = newVal;
        self.httpObject && self.generateCode(self.httpObject);
      }
    });

    self.generateCode = function (httpObject) {
      var chosenLanguageOption = _.where(self.languageOptions, {value: self.chosenLanguage})[0];
      self.code = chosenLanguageOption.generator.generateCode(httpObject, chosenLanguageOption.opts);
    };

  }
}());

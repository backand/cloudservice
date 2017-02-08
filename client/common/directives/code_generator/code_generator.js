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

  CodeGeneratorController.$inject = ['CONSTS', 'LocalStorageService', '$scope', 'VanillaGeneratorService', 'ReduxGeneratorService', 'AngularGeneratorService'];

  function CodeGeneratorController(CONSTS, LocalStorageService, $scope, VanillaGeneratorService, ReduxGeneratorService, AngularGeneratorService){
    var self = this;

    self.languageOptions = [
      {
        value: 2,
        label: 'Angular 1',
        generator: VanillaGeneratorService,
        opts: {
          type: 'return',
          es6: false,
          prefix: 'Backand',
        }
      },
      {
        value: 3,
        label: 'Angular 2',
        generator: VanillaGeneratorService,
        opts: {
          type: 'promise',
          es6: true,
          prefix: 'this.backand',
        }
      },
      {
        value: 4,
        label: 'Redux / React',
        generator: ReduxGeneratorService,
        opts: {}
      },
      {
        value: 5,
        label: 'NodeJS',
        generator: VanillaGeneratorService,
        opts: {
          type: 'promise',
          es6: false,
          prefix: 'backand',
        }
      },
      {
        value: 6,
        label: 'Angular 1 ($http)',
        generator: AngularGeneratorService,
        opts: {}
      },
      {
        value: 1,
        label: 'Vanilla JavaScript',
        generator: VanillaGeneratorService,
        opts: {
          type: 'promise',
          es6: false,
          prefix: 'backand',
        }
      }
    ];

    self.storage = LocalStorageService.getLocalStorage();
    if (!self.storage.favoriteLanguage) {
      self.chosenLanguage = 2;
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

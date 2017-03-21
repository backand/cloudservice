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
    self.storage = LocalStorageService.getLocalStorage();
    self.languageOptions = [
      {
        value: 1,
        label: 'Angular 1',
        generator: AngularGeneratorService,
        opts: {
        //  type: 'return',
        //  es6: false,
        //  prefix: 'Backand',
        },
        class: 'angular-logo-small'
      },
      {
        value: 2,
        label: 'Angular 2',
        generator: AngularGeneratorService,
        opts: {
         // type: 'promise',
         // es6: true,
         // prefix: 'this.backand',
        },
        class: 'angular-2-logo-small'
      },
      {
        value: 3,
        label: 'Ionic',
        generator: AngularGeneratorService,
        opts: {
         // type: 'promise',
         // es6: true,
         // prefix: 'this.backand',
        },
        class: 'ionic-logo-small'
      },
      {
        value: 4,
        label: 'Ionic 2',
        generator: AngularGeneratorService,
        opts: {
         // type: 'promise',
         // es6: true,
         // prefix: 'this.backand',
        },
        class: 'ionic-2-logo-small'
      },
      {
        value: 5,
        label: 'Redux / React',
        generator: ReduxGeneratorService,
        opts: {},
        class: 'react-logo-small'
      },
      {
        value: 6,
        label: 'React Native',
        generator: ReduxGeneratorService,
        opts: {
        },
        class: 'react-native-logo-small'
      },
      {
        value: 7,
        label: 'Jquery',
        generator: VanillaGeneratorService,
        opts: {
          type: 'return',
          es6: false,
          prefix: 'backand'
        },
        class: 'jquery-logo-small'
      },
      {
        value: 8,
        label: 'Vue.js',
        generator: VanillaGeneratorService,
        opts: {
          type: 'promise',
          es6: true,
          prefix: 'backand',
        },
        class: 'vuejs-logo-small'
      }
    ];

    self.showme = false;

    //Show drop down http log
    self.showMe = function(){
      if(self.showme == false){
        self.showme = true  
      }
      else{
        self.showme = false
      }
    }    

    if (!self.storage.favoriteLanguage) {
      self.chosenLanguage = 1;
    } else {
      self.chosenLanguage = self.storage.favoriteLanguage;
    }

    //Sets the icon on the drop down
    self.chosenClass = _.where(self.languageOptions, {value: self.chosenLanguage})[0].class;

    //Change the language and icon after choosing one
    self.generateSelectedLanguage = function(index){
      self.chosenLanguage = (index + 1);
      self.showMe();
      self.storage.favoriteLanguage = (index + 1);
      self.chosenClass = _.where(self.languageOptions, {value: self.chosenLanguage})[0].class;
     

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

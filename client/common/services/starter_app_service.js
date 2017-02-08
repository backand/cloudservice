(function () {
  'use strict';

  angular.module('common.services')
    .service('StarterAppService', ['$http', 'CONSTS', StarterAppService]);

  function StarterAppService($http, CONSTS) {

    var self = this;

    self.get = function (platformName) {
      var optionsHash = {};
      optionsHash[ 'RESTful API' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing web app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
          starterAppId: "restExisting"
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new web app with Back&",
          starterAppId: "restKickstart"
        }
      ];
      optionsHash[ 'AngularJS' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing Angular web app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
          starterAppId: "ng1Existing"
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new Angular web app with Back&",
          starterAppId: "ng1Kickstart"
        },
        {
          name: "To Do with Users",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates using our authentication and sign-up systems to work with a To-Do List app",
          starterAppId: "ng1Todo"
        },
        {
          name: "Back& CRUD",
          image: "assets/images/app_templates/backand_store.png",
          description: "This starter app demonstrates building a model with Create, Read, Update, and Delete functionality",
          starterAppId: "ng1Crud"
        },
        {
          name: "Back& Payments",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates connecting Back& application to a payment processor",
          starterAppId: "ng1Payments"
        }
      ];
      optionsHash[ 'Angular 2' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "Integrate Back& with an existing Angular 2 web app",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
        starterAppId: "ng2Existing"
      },
      {
        name: "Blank Project",
        image: "assets/images/app_templates/seed_project.png",
        description: "Start a new Angular 2 web app with Back&",
        starterAppId: "ng2Kickstart"
      },
      {
        name: "Back& Users",
        image: "assets/images/app_templates/to_do.png",
        description: "This starter for Angular 2 demonstrates using our authentication and sign-up systems",
        starterAppId: "ng2Users"
      },
      {
        name: "Back& Users and CRUD",
        image: "assets/images/app_templates/backand_store.png",
        description: "This starter app demonstrates building an app using a basic CRUD model and user authentication, on top of Angular 2",
        starterAppId: "ng2UsersCrud"
      }];
      optionsHash[ 'Ionic' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing Ionic app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
          starterAppId: "ionicExisting"
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new Ionic app with Back&",
          starterAppId: "ionicKickstart"
        },
        {
          name: "Ionic Starter with Social",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates using our social media authentication capabilities",
          starterAppId: "ionicStarterSocial"
        },
        {
          name: "Ionic Chat Starter",
          image: "assets/images/app_templates/backand_store.png",
          description: "This starter app demonstrates building a chat app using sockets through Backand's SDK",
          starterAppId: "ionicChat"
        }
      ];
      optionsHash[ 'Ionic 2' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "Integrate Back& with an existing Ionic 2 web app",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
        starterAppId: "ionic2Existing"
      },
      {
        name: "Blank Project",
        image: "assets/images/app_templates/seed_project.png",
        description: "Start a new Ionic 2 app with Back&",
        starterAppId: "ionic2Kickstart"
      },
      {
        name: "Ionic 2 Back& Starter",
        image: "assets/images/app_templates/to_do.png",
        description: "This starter demonstrates a simple integration with Back& using a lightweight 'ToDo' list management app",
        starterAppId: "ionic2ToDo"
      }];
      optionsHash[ 'React' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing React web app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
          starterAppId: "reactExisting"
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new React web app with Back&",
          starterAppId: "reactKickstart"
        }
      ];
      optionsHash[ 'React Native' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing React Native app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png'],
          starterAppId: "reactNativeExisting"
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new React Native app with Back&",
          starterAppId: "reactNativeKickstart"
        }
      ];
      return optionsHash[platformName];
    };
  }

})();

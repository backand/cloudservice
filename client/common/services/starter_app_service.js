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
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new web app with Back&"
        }
      ];
      optionsHash[ 'AngularJS' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing Angular web app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new Angular web app with Back&"
        },
        {
          name: "To Do with Users",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates using our authentication and sign-up systems to work with a To-Do List app"
        },
        {
          name: "Back& CRUD",
          image: "assets/images/app_templates/backand_store.png",
          description: "This starter app demonstrates building a model with Create, Read, Update, and Delete functionality"
        },
        {
          name: "Back& Payments",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates connecting Back& application to a payment processor"
        }
      ];
      optionsHash[ 'Angular 2' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "Integrate Back& with an existing Angular 2 web app",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
        image: "assets/images/app_templates/seed_project.png",
        description: "Start a new Angular 2 web app with Back&"
      },
      {
        name: "Back& Users",
        image: "assets/images/app_templates/to_do.png",
        description: "This starter for Angular 2 demonstrates using our authentication and sign-up systems"
      },
      {
        name: "Back& Users and CRUD",
        image: "assets/images/app_templates/backand_store.png",
        description: "This starter app demonstrates building an app using a basic CRUD model and user authentication, on top of Angular 2"
      }];
      optionsHash[ 'Ionic' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing Ionic app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new Ionic app with Back&"
        },
        {
          name: "Ionic Starter with Social",
          image: "assets/images/app_templates/to_do.png",
          description: "This starter demonstrates using our social media authentication capabilities"
        },
        {
          name: "Ionic Chat Starter",
          image: "assets/images/app_templates/backand_store.png",
          description: "This starter app demonstrates building a chat app using sockets through Backand's SDK"
        }
      ];
      optionsHash[ 'Ionic 2' ] = [{
        name: "Existing Project",
        image: "assets/images/app_templates/blank_project.png",
        description: "Integrate Back& with an existing Ionic 2 web app",
        images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
      },
      {
        name: "Blank Project",
        image: "assets/images/app_templates/seed_project.png",
        description: "Start a new Ionic 2 app with Back&"
      },
      {
        name: "Ionic 2 Back& Starter",
        image: "assets/images/app_templates/to_do.png",
        description: "This starter demonstrates a simple integration with Back& using a lightweight 'ToDo' list management app"
      }];
      optionsHash[ 'React' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing React web app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new React web app with Back&"
        }
      ];
      optionsHash[ 'React Native' ] = [
        {
          name: "Existing Project",
          image: "assets/images/app_templates/blank_project.png",
          description: "Integrate Back& with an existing React Native app",
          images: ['assets/images/postgresql.jpg', 'assets/images/mysql.png']
        },
        {
          name: "Blank Project",
          image: "assets/images/app_templates/seed_project.png",
          description: "Start a new React Native app with Back&"
        }
      ];
      return optionsHash[platformName];
    };
  }

})();

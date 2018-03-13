# [angular-kickstart](http://vesparny.github.io/angular-kickstart/)

[![Build Status](https://secure.travis-ci.org/vesparny/angular-kickstart.svg)](http://travis-ci.org/vesparny/angular-kickstart)

**Brought to you by [Alessandro Arnodo](http://alessandro.arnodo.net) [[@vesparny](https://twitter.com/vesparny)]**

[![Dev dependency status](https://david-dm.org/vesparny/angular-kickstart/dev-status.png)](https://david-dm.org/vesparny/angular-kickstart#info=devDependencies "Dependency status")

**Speed up your [AngularJS](http://angularjs.org) development with a complete and scalable gulpjs based build system that scaffolds the project for you. Just focus on your app, angular-kickstart will take care of the rest.**
***

#### See a [working demo](http://vesparny.github.io/angular-kickstart/).

### What and Why

angular-kickstart is an opinionated kickstart for single page application development with AngularJS. It makes your development and testing easy, keeps the structure of the project consistent and allows you to create a fully optimized production release with ease. After having developed a lot of AngularJS projects I decided to collect here what I've learnt.

### Getting started

Install **node.js**. Then **sass**, **gulp** and **bower** if you haven't yet.

    $ gem install sass
    $ npm -g install gulp bower

After that, install angular-kickstart downloading the [latest release](https://github.com/vesparny/angular-kickstart/releases) (or clone the master branch if you want to run the development version). Unzip the project and cd into it, then install bower and npm dependencies, and run the application in development mode.

    $ npm install
    $ bower install

### Run locally

Update the `client/config/env/local.json` file with your server side address and run:

    $ gulp local:dist

You are now ready to go, your application is available at **http://127.0.0.1:3000**.

### Deploy to Production

Update the `client/config/env/prod.json` file with your server side address and run:

    $ gulp prod:dist

Copy the content of `build/dist` folder into a web server or s3 bucket.


### License

See LICENSE file

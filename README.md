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
    $ gulp serve

You are now ready to go, your application is available at **http://127.0.0.1:3000**.

**Every file you add, edit or delete into the `/client` folder will be handled by the build system**.

When you are ready to build a production release there is a task for that:

    $ gulp prod:dist

This task will lint your code, optimize css js and images files, run unit tests. After the task has successfully finished, you can find an optimized version of your project inside the  `/build/dist` folder


### Directory Structure

* `build/` - Build files and configuration, the most important files to note are `build.config.js`, `protractor.config.js` and `karma.config.js`. These files are the heart of the build system. Take a look.
* `client/` the source code and tests of your application, take a look at the modules in this folder, you should structure your application following those conventions, but you can choose another convention as well.
* `.bowerrc` - the bower configuration file. This tells Bower to install components in the `client/src/vendor` directory.
* `.jshintrc` - JSHint configuration.
* `gulpfile` - see [The Build System](#thebuildsystem) below.
* `bower.json` - Contains the list of bower dependencies.
* `package.json` - node.js dependencies.

### <a name="thebuildsystem"></a>The Build System

There are some `tasks` available in `gulpfile.js`. You can dig into the file to familiarize yourself with gulpjs.

A description of every available task:

* **gulp serve** - When this task runs, the build will take care of watching filea. Every time you change a file into the `client/` folder, the build recompiles every file, and your browser will reload automagically showing you changes.
You just need to add new JavaScript and css files in the `client/index.html` file.
* **gulp serve:dist** - This task will run jshint and unit tests under the `client/test/unit` folder (thanks to `karma runner`), and create a fully-optimized version of your application under the `build/dist/` folder. The optimization consists of concatenate, minify and compress js and css files, optimize images, and put every template into a js file loaded by the application.
A code coverage report will be available inside the `client/test/unit-results`.
* **gulp test:e2e** - Run end-to-end tests inside the `client/test/e2e` folder with `protractor`. If a test fails, you should find a screenshot of the page inside the `client/test/screenshots` folder.
**Note that you need to have the application running in order to run e2e tests. You can launch this task from another terminal instance.**

### License

See LICENSE file



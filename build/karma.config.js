'use strict';

var baseDir = 'client';

module.exports = {

  //This is the list of file patterns to load into the browser during testing.
  files: [
    baseDir + '/vendor/angular/angular.js',
    baseDir + '/vendor/angular-mocks/angular-mocks.js',
    baseDir + '/vendor/angular-ui-router/release/angular-ui-router.js',
    baseDir + '/config/**/*.js',
    baseDir + '/common/**/*.js',
    baseDir + '/views/**/*.js',
    baseDir + '/app.js',
    'build/tmp/*.js',
    baseDir + '/test/unit/**/*.spec.js'
  ],

  //used framework
  frameworks: ['jasmine'],

  plugins: [
    'karma-chrome-launcher',
    'karma-phantomjs-launcher',
    'karma-jasmine',
    'karma-coverage',
    'karma-html-reporter',
    'karma-mocha-reporter'
  ],

  //preprocessors: {
  //  '**/client/**/*.js': 'coverage'
  //},

  //reporters: ['mocha', 'html'],

  //coverageReporter: {
  //  type: 'html',
  //  dir: baseDir + '/test/unit-results/coverage',
  //  file: 'coverage.html'
  //},

  //htmlReporter: {
  //  outputDir: baseDir + '//test/unit-results/html'
  //},

  logLevel: 'info',

  urlRoot: '/__test/',

  //used browsers (overriddeng in some gulp task)
  browsers: ['Chrome'],

};

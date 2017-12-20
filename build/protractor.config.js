'use strict';

//this is the port the application is running on
var port = 3001;
//jshint strict: false
exports.config = {


  specs: [
    '../test/e2e/**/*.scenario.js'
  ],


  capabilities: {
    'browserName': 'chrome'
  },
  shardTestFiles: true,
  maxInstances: 2,

  baseUrl: 'http://localhost:' + port,

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000,
    isVerbose: false,
    showColors: true,
    includeStackTrace: false,
  },
  allScriptsTimeout: 200000,
  onPrepare: function () {
    browser.driver.manage().timeouts().implicitlyWait(60000);
    global.helpers = require('../test/e2e/helpers.js');
  }


};

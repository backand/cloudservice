'use strict';

//this is the port the application is running on
var port =  3001;

exports.config = {
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  specs: [
    '../test/e2e/**/*.scenario.js'
  ],

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--incognito']
    },
    shardTestFiles: true,
    maxInstances: 2
  },
  seleniumArgs: ['-browserTimeout=60'],
  baseUrl: 'http://127.0.0.1:'+port,
  onPrepare: function () {
    global.helpers = require('../test/e2e/helpers.js');
  }
};

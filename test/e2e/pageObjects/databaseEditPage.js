'use strict';

function DatabaseEditPage() {
  this._init = function() {
    this.title = element(by.testHook('database-edit.title'));
  };

  this._init();
}

module.exports = new DatabaseEditPage();
'use strict';

function AppsPage() {
  this._init = function() {
    this._initNewApp();
  };

  this._initNewApp = function() {
    this.newApp = {
      nameInput: element(by.testHook('apps.new-app.name')),
      titleInput: element(by.testHook('apps.new-app.title')),
      createButton: element(by.testHook('apps.new-app.create')),
      errorLabel: element(by.testHook('apps.new-app.error')),
      fillIn: function(app) {
        if (app.name) helpers.fillInput(this.nameInput, app.name);
        if (app.title) helpers.fillInput(this.titleInput, app.title);
      },
      create: function(app) {
        this.fillIn(app);
        this.createButton.click();
      }
    };
  };

  this._init();
}

module.exports = new AppsPage();
(function () {

  angular.module('common.modals')
    .controller('ConfirmModelUpdateController', [
      '$modalInstance',
      'titles',
      'validationResponse',
      ConfirmModelUpdateController
    ]);

  function ConfirmModelUpdateController(modalInstance,
                                        titles,
                                        validationResponse) {
    var self = this;

    self.detailsTitle = titles.detailsTitle;
    self.validationResponse = validationResponse;

    self.notifications =
      _.uniq(_.map(_.flatten(_.map(validationResponse.notifications)),
      angular.toJson));
    if (_.isEmpty(self.notifications)) {
      self.notifications = null;
    }

    if (!_.isEmpty(validationResponse[titles.resultProperty])) {
      if (validationResponse[titles.resultProperty] instanceof Array) {
        self.result = _.uniq(validationResponse[titles.resultProperty]);
        self.details = 'array';
      } else {
        self.result = validationResponse[titles.resultProperty];
        self.details = 'string';

      }
    }

    switch (self.validationResponse.valid) {
      case 'never':
        self.text = {
          title: 'Errors in ' + _.capitalize(titles.itemName),
          message: 'Please fix the following errors in the ' + titles.itemName + ':',
          cssClass: 'danger',
          cancelButton: 'Return'
        };
        self.notifications = _.uniq(self.validationResponse.warnings);
        break;

      case 'always':
        self.text = {
          title: _.capitalize(titles.itemName) + ' is Valid',
          cssClass: 'success',
          okButton: 'OK',
          cancelButton: 'Cancel'
        };
        if (self.notifications) {
          self.text.message = 'The ' + _.capitalize(titles.itemName) + ' is valid.<br>' +
            'The following parts of the ' + titles.itemName + ', including the data they contain, will be permanently deleted.<br>' +
            'Click Ok to proceed';
          self.text.cssClass = 'danger';
          self.text.title = 'Warning';
        } else {
          self.text.message = 'Click Ok to proceed';
        }
        break;

      case 'data':
            self.text = {
              title: 'Warning',
              cssClass: 'danger',
              okButton: 'OK',
              cancelButton: 'Cancel'
            };
        if (self.notifications) {
          self.text.message = 'The ' + _.capitalize(titles.itemName) + ' is valid.<br>' +
            'The following parts of the ' + titles.itemName + ', including the data they contain, will be permanently deleted.<br>' +
            'Changes made to the ' + titles.itemName + ' include changes to fields types.<br>' +
            'Those changes may result in a loss or corruption of data.<br>' +
            'Click Ok to proceed';
        } else {
          self.notifications = _.uniq(self.validationResponse.warnings);
          self.text.message = 'The ' +  _.capitalize(titles.itemName) + ' is valid.<br>' +
            'Changes made to the ' + titles.itemName + ' include changes to fields types.<br>' +
            'Those changes may result in a loss or corruption of data.<br>' +
            'Click Ok to proceed';
        }
        break;
    }

    self.closeValidationModal = function (result) {
      modalInstance.close(result);
    };

  }

}());

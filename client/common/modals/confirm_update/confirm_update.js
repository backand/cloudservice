(function () {

  angular.module('common.modals')
    .controller('ConfirmModelUpdateController', [
      '$modalInstance',
      'itemName',
      'validationResponse',
      ConfirmModelUpdateController
    ]);

  function ConfirmModelUpdateController(modalInstance,
                                        itemName,
                                        validationResponse) {
    var self = this;

    self.itemName = itemName;
    self.validationResponse = validationResponse;

    self.notifications =
      _.uniq(_.map(_.flatten(_.map(validationResponse.notifications)),
      angular.toJson));
    if (_.isEmpty(self.notifications)) {
      self.notifications = null;
    }

    self.validationResponse.alter = _.uniq(self.validationResponse.alter);
    self.details = !_.isEmpty(self.validationResponse.alter);

    switch (self.validationResponse.valid) {
      case 'never':
        self.text = {
          title: 'Errors in ' + _.capitalize(self.itemName),
          message: 'Please fix the following errors in the ' + self.itemName + ':',
          cssClass: 'danger',
          cancelButton: 'Return'
        };
        self.notifications = _.uniq(self.validationResponse.warnings);
        break;

      case 'always':
        self.text = {
          title: _.capitalize(self.itemName) + ' is Valid',
          cssClass: 'success',
          okButton: 'OK',
          cancelButton: 'Cancel'
        };
        if (self.notifications) {
          self.text.message = 'The ' + _.capitalize(self.itemName) + ' is valid.<br>' +
            'The following parts of the ' + self.itemName + ', including the data they contain, will be permanently deleted.<br>' +
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
          self.text.message = 'The ' + _.capitalize(self.itemName) + ' is valid.<br>' +
            'The following parts of the ' + self.itemName + ', including the data they contain, will be permanently deleted.<br>' +
            'Changes made to the ' + self.itemName + ' include changes to fields types.<br>' +
            'Those changes may result in a loss or corruption of data.<br>' +
            'Click Ok to proceed';
        } else {
          self.notifications = _.uniq(self.validationResponse.warnings);
          self.text.message = 'The ' +  _.capitalize(self.itemName) + ' is valid.<br>' +
            'Changes made to the ' + self.itemName + ' include changes to fields types.<br>' +
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

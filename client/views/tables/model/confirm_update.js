(function () {

  angular.module('backand')
    .controller('ConfirmModelUpdateController', [
      '$modalInstance',
      'validationResponse',
      ConfirmModelUpdateController
    ]);

  function ConfirmModelUpdateController(modalInstance,
                                        validationResponse) {
    var self = this;

    self.validationResponse = validationResponse;

    self.notifications =
      _.map(_.flatten(_.map(validationResponse.notifications)),
      angular.toJson);
    if (_.isEmpty(self.notifications)) {
      self.notifications = null;
    }

    self.details = !_.isEmpty(self.validationResponse.alter);

    switch (self.validationResponse.valid) {
      case 'never':
        self.text = {
          title: 'Errors in Model',
          message: 'Please fix the following errors in the model:',
          cssClass: 'danger',
          cancelButton: 'return'
        };
        self.notifications = self.validationResponse.warnings;
        break;

      case 'always':
        self.text = {
          title: 'Model is Valid',
          cssClass: 'success',
          okButton: 'OK',
          cancelButton: 'cancel'
        };
        if (self.notifications) {
          self.text.message = 'The Model is valid.<br>' +
            'The following parts of the model, including the data they contain, will be permanently deleted.<br>' +
            'Please click Ok to proceed';
          self.text.cssClass = 'danger';
          self.text.title = 'Warning';
        } else {
          self.text.message = 'Please click Ok to proceed';
        }
        break;

      case 'data':
            self.text = {
              title: 'Warning',
              cssClass: 'danger',
              okButton: 'OK',
              cancelButton: 'cancel'
            };
        if (self.notifications) {
          self.text.message = 'The Model is valid.<br>' +
            'The following parts of the model, including the data they contain, will be permanently deleted.<br>' +
            'Changes made to the model include changes to fields types.<br>' +
            'Those changes may result in a loss or corruption of data.<br>' +
            'Please click Ok to proceed';
        } else {
          self.text.message = 'The Model is valid.<br>' +
            'Changes made to the model include changes to fields types.<br>' +
            'Those changes may result in a loss or corruption of data.<br>' +
            'Please click Ok to proceed';
        }
        break;
    }

    self.closeValidationModal = function (result) {
      modalInstance.close(result);
    };

  }

}());

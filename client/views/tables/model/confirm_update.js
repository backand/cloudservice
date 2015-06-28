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

    switch (self.validationResponse.valid) {
      case 'never':
        self.text = {
          title: 'Errors in Model',
          message: 'Please fix the following errors in the model:',
          cssClass: 'error',
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
        if (self.validationResponse.notifications) {
          self.text.message = 'The Model is valid.\n' +
            'The following parts of the model, including the data they contain, will be permanently deleted.\n' +
            'proceed anyway?';
          self.notifications = self.validationResponse.notifications;
        } else {
          self.text.message = 'The Model is valid, please click Ok to proceed';
        }
        break;
      case 'data':
            self.text = {
              title: 'Model is Valid',
              cssClass: 'success',
              okButton: 'OK',
              cancelButton: 'cancel'
            };
        if (self.validationResponse.notifications) {
          self.text.message = 'The Model is valid.\n' +
            'The following parts of the model, including the data they contain, will be permanently deleted.\n' +
            'Changes made to the model include changes to fields types.\n' +
            'Those changes may result in a loss or corruption of data. \n' +
            'Proceed anyway?';
          self.notifications = self.validationResponse.notifications;
        } else {
          self.text.message = 'The Model is valid.\n' +
            'Changes made to the model include changes to fields types.\n' +
            'Those changes may result in a loss or corruption of data.\n' +
            'Proceed anyway?';
        }
        break;
    }

    self.closeValidationModal = function (result) {
      modalInstance.close(result);
    };

  }

}());

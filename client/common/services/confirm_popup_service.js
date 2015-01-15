(function () {

  /**
   *  wrap bootstrap modal
   *
   * @param $modal
   * @param $rootScope
   * @constructor
   */
  function ConfirmationPopupService($modal, $rootScope) {

    var self = this;

    (function init() {
      self.modalScope = $rootScope.$new(true);
    }());

    /**
     * launce modal with custom scope and
     * configuration
     *
     * @param msg
     * @param okText
     * @param cancelText
     * @returns {modalInstance.result|*}
     */
    self.confirm = function (msg, okText, cancelText) {

      self.modalScope.msg = msg;
      self.modalScope.okBtnText = okText || 'OK';
      self.modalScope.cancelBtnText = cancelText || 'CANCEL';

      self.modalScope.close = function (result) {
        modalInstance.close(result);
      };

      var modalInstance = $modal.open({
        templateUrl: 'common/services/confirm_popup_service.html',
        backdrop: 'static',
        scope: self.modalScope,
        keyboard: false,
        size: 'sm'
      });

      return modalInstance.result;
    }
  }

  angular.module('app')
    .service('ConfirmationPopup', ['$modal', '$rootScope', ConfirmationPopupService])
}());

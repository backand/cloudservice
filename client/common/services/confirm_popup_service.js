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

    self.setTitle = function(title){
      self.modalScope.Title = title;
    }

    /**
     * launce modal with custom scope and
     * configuration
     *
     * @param msg
     * @param okText
     * @param cancelText
     * @returns {modalInstance.result|*}
     */
    self.confirm = function (msg, okText, cancelText, showOk, showCancel) {

      self.modalScope.msg = msg;
      self.modalScope.okBtnText = okText || 'OK';
      self.modalScope.cancelBtnText = cancelText || 'CANCEL';
      self.modalScope.showOk = angular.isDefined(showOk) ? showOk : true;
      self.modalScope.showCancel = angular.isDefined(showCancel) ? showCancel : true;

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

  angular.module('common.services')
    .service('ConfirmationPopup', ['$modal', '$rootScope', ConfirmationPopupService])
}());

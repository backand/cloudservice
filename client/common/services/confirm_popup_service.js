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
    self.confirm = function (msg, okText, cancelText, showOk, showCancel, title, size) {

      self.modalScope.msg = msg;
      if (isJson(msg)) {
        self.modalScope.type = 'json';
      } else if(msg.indexOf('function backandCallback')>-1)  {
        self.modalScope.type = 'text';
      } else {
        self.modalScope.type = '';
      }

      self.modalScope.okBtnText = okText || 'OK';
      self.modalScope.cancelBtnText = cancelText || 'CANCEL';
      self.modalScope.showOk = angular.isDefined(showOk) ? showOk : true;
      self.modalScope.showCancel = angular.isDefined(showCancel) ? showCancel : true;
      self.modalScope.Title = title;

      self.modalScope.close = function (result) {
        modalInstance.close(result);
      };

      var modalInstance = $modal.open({
        templateUrl: 'common/services/confirm_popup_service.html',
        scope: self.modalScope,
        keyboard: false,
        size: size || 'sm'
      });

      return modalInstance.result;
    };

    function isJson(item) {
      item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

      try {
        item = JSON.parse(item);
      } catch (e) {
        return false;
      }

      if (typeof item === "object" && item !== null) {
        return true;
      }

      return false;
    }
  }

  angular.module('common.services')
    .service('ConfirmationPopup', ['$modal', '$rootScope', ConfirmationPopupService])
}());

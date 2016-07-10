/**
 * Description here:
 *
 * @author Yure Pereira
 * @since 26-06-2016
 * @version 1.0.0
 */
var modal = (function($, w, d, u) {

  var _modal = new Function();

  var template = null,
      modalTemplate = null,
      path = '../js/parcial/',
      opend = false,
      _this = new _modal();

  //Queue to execution.
  var queue = {
    alert: [],
    popup: []
  };

  var partialTemplate = {
    //Partial template for alert modal
    alert: {
      url: path + 'alert.html',
      selector: {
        modal: '.f3-modal',
        title: '.f3-title > h1',
        close: '.f3-close',
        body: '.f3-body',
        footer: '.f3-footer',
        okay: '.btn-f3-ok'
      },
      cacheHTML: null
    },
    //Partial template for popup modal
    popup: {
      url: path + 'popup.html',
      selector: {
        modal: '.f3-modal',
        close: '.f3-close',
        body: '.f3-body',
      },
      cacheHTML: null
    },
    comfirm: '',
    form: '',
    iframe: ''
  };

  //Default values of variables and functions
  var defaultSetting = {
    action: {
      open: function(selector, callback, parameters) {

        var element = $(selector);
        element.addClass('f3-opend');

        //Model state opend
        opend = true;

        callback = typeof callback == 'function' ? callback : function() {};
        parameters = Array.isArray(parameters) ? parameters : [];

        element.fadeIn(300, function() {
          callback.apply(null, parameters);
        });

      },
      close: function(selector, callback, parameters) {

        var element = $(selector);

        //Model state closed
        opend = false;

        callback = typeof callback == 'function' ? callback : function() {};
        parameters = Array.isArray(parameters) ? parameters : [];

        element.fadeOut(300, function() {

          $(this).remove();
          callback.apply(null, parameters);

          //If queue length bigger then 0 run next in queue
          for (var modal in queue) {
            if (queue.hasOwnProperty(modal) && queue[modal].length > 0) {

              //Find modal function name
              var fn = _this['_' + modal];

              if (typeof fn === 'function') {
                fn.apply(null, [queue[modal].shift()]);
              }

            }
          }

        });

      },
      isOpend: function() {
        return opend;
      }
    }
  };

  _modal.prototype._init = function(callback, parameters) {

    //Generic code here.

    if (typeof callback === 'function') {
      callback.apply(null, parameters);
    }

  };

  /**
   * @param {object} config {
   * @example
   * _alert({
   *     title: '',
   *     message: '',
   *     callbackClosed: function() {}
   * })
   *
   */
   _modal.prototype._alert = function(config) {

    //Load template alert
    var init = function(data) {

      _this._init(function(data) {

        modalTemplate = $(data);
        var modal = modalTemplate.find(partialTemplate.alert.selector.modal),
          title = modalTemplate.find(partialTemplate.alert.selector.title),
          close = modalTemplate.find(partialTemplate.alert.selector.close),
          body = modalTemplate.find(partialTemplate.alert.selector.body),
          footer = modalTemplate.find(partialTemplate.alert.selector.footer),
          btnOkay = modalTemplate.find(partialTemplate.alert.selector.okay);

        title.html(config.title);
        body.html(config.message);

        //Callback Closed
        config.callbackClosed = config.hasOwnProperty('callbackClosed') && typeof config.callbackClosed == 'function' ? config.callbackClosed : null;
        //Events
        close.click(function() {
          defaultSetting.action.close.apply(this, [partialTemplate.alert.selector.modal, config.callbackClosed]);
        });
        btnOkay.click(function() {
          defaultSetting.action.close.apply(this, [partialTemplate.alert.selector.modal, config.callbackClosed]);
        });

        if (!opend) {

          //Add alert modal on the page document.
          modalTemplate.attr('style', 'display: none');
          $(d.body).append(modalTemplate);
          defaultSetting.action.open(partialTemplate.alert.selector.modal);

        } else {
          queue.alert.push(config);
        }

      }, [data]);

    };

    var cacheData = partialTemplate.alert.cacheHTML;
    if (cacheData != null) {

      init.apply(null, [cacheData]);

    } else {
      $.get(partialTemplate.alert.url, function(data) {

        init.apply(null, [data]);
        //Save cache html page modal alert.
        partialTemplate.alert.cacheHTML = data;

      }).fail(function() {
          throw 'Error: without internet access.';
          //alert('Error: without internet access.');
      });
    }

  };

  /**
   * @param {object} config {
   * @example
   * _popup({
   *     content: '',
   *     callbackClosed: function() {}
   * })
   *
   */
  _modal.prototype._popup = function(config) {

    //Init popup config
    var init = function(data) {

      _this._init(function(data) {

        modalTemplate = $(data);
        var modal = modalTemplate.find(partialTemplate.popup.selector.modal),
          close = modalTemplate.find(partialTemplate.popup.selector.close),
          body = modalTemplate.find(partialTemplate.popup.selector.body);

        body.html(config.content);

        //Callback Closed
        config.callbackClosed = config.hasOwnProperty('callbackClosed') && typeof config.callbackClosed == 'function' ? config.callbackClosed : null;
        //Events
        close.click(function() {
          defaultSetting.action.close.apply(this, [partialTemplate.popup.selector.modal, config.callbackClosed]);
        });

        if (!opend) {

          modalTemplate.attr('style', 'display: none');
          $(d.body).append(modalTemplate);
          defaultSetting.action.open(partialTemplate.popup.selector.modal);

        } else {
          queue.popup.push(config);
        }

      }, [data]);

    };

    var cacheData = partialTemplate.popup.cacheHTML;
    if (cacheData != null) {

      init.apply(this, [cacheData]);

    } else {
      $.get(partialTemplate.popup.url, function(data) {

        init.apply(this, [data]);
        //Save cache html page modal popup.
        partialTemplate.popup.cacheHTML = data;

      }).fail(function() {
        throw 'Error: without internet access.';
        //alert('Error: without internet access.');
      });
    }

  };

  return {
    alert: _this._alert,
    popup: _this._popup,
    isOpend: function() {
      return defaultSetting.action.isOpend();
    }
  };

})(jQuery, window, document);

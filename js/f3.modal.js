/**
 * Description here:
 *
 * @author Yure Pereira
 * @since 26-06-2016
 * @version 1.0.0
 */
var modal = (function($, w, d, u) {

  var template = null,
      modalTemplate = null,
      path = '../js/parcial/',
      opend = false;

  //Queue to execution.
  var queue = {
    alert: []
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
      open: function(selector, func, parameters) {

        var element = $(selector);
        element.addClass('f3-opend');

        //Model state opend
        opend = true;

        func = typeof func == 'function' ? func : function() {};
        parameters = Array.isArray(parameters) ? parameters : [];

        element.fadeIn(300, function() {
          func.apply(this, parameters);
        });

      },
      close: function(selector, func, parameters) {

        var element = $(selector);

        //Model state closed
        opend = false;

        func = typeof func == 'function' ? func : function() {};
        parameters = Array.isArray(parameters) ? parameters : [];

        element.fadeOut(300, function() {

          $(this).remove();
          func.apply(this, parameters);

          //If queue length bigger then 0 run next in queue
          if (queue.alert.length > 0) {
             _alert(queue.alert.shift());
          }

        });

      },
      isOpend: function() {
        return opend;
      }
    }
  };

  /**
   * @param Object config {
   * @example
   * _alert({
   * title: '',
   * message: '',
   * callbackClosed: function() {}
   *
   *
   * })
   *
   */
  var _alert = function(config) {

    //Load template alert
    var init = function(data) {

      modalTemplate = $(data);
      var modal = modalTemplate.find(partialTemplate.alert.selector.modal),
        title = modalTemplate.find(partialTemplate.alert.selector.title),
        close = modalTemplate.find(partialTemplate.alert.selector.close),
        body = modalTemplate.find(partialTemplate.alert.selector.body),
        footer = modalTemplate.find(partialTemplate.alert.selector.footer);
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

    };

    var cacheData = partialTemplate.alert.cacheHTML;
    if (cacheData != null) {

      init.apply(this, [cacheData]);

    } else {
      $.get(partialTemplate.alert.url, function(data) {

        init.apply(this, [data]);
        //Save cache html page modal alert.
        partialTemplate.alert.cacheHTML = data;

      }).fail(function() {
          alert('Error');
      });
    }

  };

  var _popup = function(config) {

    //Init popup config
    var init = function(data) {

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
          alert('Error');
      });
    }

  };

  return {
    alert: _alert,
    popup: _popup,
    isOpend: function() {
      return defaultSetting.action.isOpend();
    }
  };

})(jQuery, window, document);

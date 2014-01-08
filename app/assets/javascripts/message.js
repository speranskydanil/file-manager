var Message = (function () {
  var default_settings = {
    title: '',
    content: '',
    size: 'normal',
    callback: function () {},
    value: '',

    translations: {
      ok: 'Ok',
      cancel: 'Cancel'
    }
  };

  function create (config) {
    $('body').addClass('msglib-body');
    $('body').append('<div class="msglib-overlay">');

    setTimeout(function () {
      $('.msglib-overlay').addClass('in');
    }, 0);

    $('body').append(
      '<div class="msglib msglib-' + config.type + ' msglib-' + config.size + '">' +
        '<div class="msglib-wrapper">' +
          '<div class="msglib-header">' +
            '<span class="msglib-title">' + config.title + '</span>' +
            '<button class="msglib-close"></button>' +
            '<div style="clear: both"></div>' +
          '</div>' +
          '<div class="msglib-content">' + config.content + '</div>' +
          '<div class="msglib-input">' +
            '<input type="text" value="' + config.value + '">' +
          '</div>' +
          '<div class="msglib-footer">' +
            '<button class="msglib-ok">' + config.translations.ok + '</button> ' +
            '<button class="msglib-cancel">' + config.translations.cancel + '</button> ' +
            '<div style="clear: both"></div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    setTimeout(function () {
      $('.msglib').addClass('in');
    }, 0);

    $('.msglib-close, .msglib-cancel').click(function () {
      config.callback(config.negative_value);
      destroy();
    });

    $('.msglib-ok').click(function () {
      config.callback(config.positive_function());
      destroy();
    });
  }

  function destroy () {
    $('.msglib-overlay').removeClass('in');
    $('.msglib').removeClass('in');

    setTimeout(function () {
      $('.msglib-overlay').remove();
      $('.msglib').remove();

      $('body').removeClass('msglib-body');
    }, 250);
  }

  return {
    translate: function (_translations) {
      $.extend(true, default_settings.translations, _translations);
    },

    alert: function (config) {
      create($.extend(true, {}, default_settings, config, {
        type: 'alert',
        negative_value: undefined,
        positive_function: function () {
          return;
        }
      }));
    },

    confirm: function (config) {
      create($.extend(true, {}, default_settings, config, {
        type: 'confirm',
        negative_value: false,
        positive_function: function () {
          return true;
        }
      }));
    },

    prompt: function (config) {
      create($.extend(true, {}, default_settings, config, {
        type: 'prompt',
        negative_value: false,
        positive_function: function () {
          return $('.msglib input').val();
        }
      }));
    }
  };
})();


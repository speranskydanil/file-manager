var FM = {
  init: function (selector) {
    $(selector)
      .addClass('fm')
      .append('<div class="switcher"></div>')
      .append(
        '<div class="area area-1">' +
          '<div class="cur-dir"></div>' +
          '<div class="toolbar"></div>' +
          '<div class="area-table"></div>' +
        '</div>')
      .append(
        '<div class="area area-2">' +
          '<div class="cur-dir"></div>' +
          '<div class="toolbar"></div>' +
          '<div class="area-table"></div>' +
        '</div>')
      .append('<div style="clear: both"></div>');

    $(selector).find('.switcher').click(function () {
      if ($(selector).hasClass('fm-one')) {
        $(selector).find('.area-2').css({ height: 0 }).toggle();

        setTimeout(function () {
          $(selector).toggleClass('fm-one');

          setTimeout(function () {
            $(selector).find('.area-2').css({ height: 'auto' })
          }, 20);
        }, 20);
      } else {
        $(selector).toggleClass('fm-one');

        setTimeout(function () {
          $(selector).find('.area-2').toggle();
        }, 350);
      }
    });

    var main_controller = this.MainController();

    var area_1 = this.Area('.fm .area-1', main_controller);
    var area_2 = this.Area('.fm .area-2', main_controller);

    main_controller.set_areas(area_1, area_2);
  }
};


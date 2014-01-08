var FM = {
  init: function (selector) {
    $(selector)
      .addClass('fm')
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

    var main_controller = this.MainController();

    var area_1 = this.Area('.fm .area-1', main_controller);
    var area_2 = this.Area('.fm .area-2', main_controller);

    main_controller.set_areas(area_1, area_2);
  }
};


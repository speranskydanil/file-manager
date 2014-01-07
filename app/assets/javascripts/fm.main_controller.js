FM.MainController = function () {
  return {
    set_areas: function (area_1, area_2) {
      this.area_1 = area_1;
      this.area_2 = area_2;
    },

    update: function () {
      this.area_1.Controller.index();
      this.area_2.Controller.index();
    },

    with_buffer: function () {
      return !!this.buffer_items;
    },

    cut: function (items) {
      this.buffer_type = 'cut';
      this.buffer_items = items;
    },

    copy: function (items) {
      this.buffer_type = 'copy';
      this.buffer_items = items;
    },

    paste: function (path) {
      var self = this;

      $.each(this.buffer_items, function (i, item) {
        var new_item_path = path + '/' + item.name;

        if (self.buffer_type == 'cut') {
          $.ajax({
            url: '/move/' +
                 encodeURIComponent(item.path) +
                 '/' +
                 encodeURIComponent(new_item_path),
            type: 'POST',
            async: false,
          });
        }

        if (self.buffer_type == 'copy') {
          $.ajax({
            url: '/copy/' +
                 encodeURIComponent(item.path) +
                 '/' +
                 encodeURIComponent(new_item_path),
            type: 'POST',
            async: false,
          });
        }
      });

      this.buffer_type = undefined;
      this.buffer_items = undefined;

      this.update();
    },

    delete: function (items) {
      if (!confirm('Are you sure?')) return;

      $.each(items, function (i, item) {
        $.ajax({
          url: '/remove/' + encodeURIComponent(item.path),
          type: 'POST',
          async: false,
        });
      });

      this.update();
    },

    rename: function (item) {
      var p = prompt('New name', item.name);
      if (!p) return;

      $.ajax({
        url: '/rename/' +
             encodeURIComponent(item.path) +
             '/' +
             encodeURIComponent(p),
        type: 'POST',
        async: false,
      });

      this.update();
    },

    zip: function (item) {
      var p = prompt('Name', item.name);
      if (!p) return;

      $.ajax({
        url: '/zip/' +
             encodeURIComponent(item.path) +
             '/' +
             encodeURIComponent(p),
        type: 'POST',
        async: false,
      });

      this.update();
    },

    unzip: function (item) {
      var p = prompt('Name', item.name.replace('.zip', ''));
      if (!p) return;

      $.ajax({
        url: '/unzip/' +
             encodeURIComponent(item.path) +
             '/' +
             encodeURIComponent(p),
        type: 'POST',
        async: false,
      });

      this.update();
    },

    download: function (item) {
      window.open('/download/' + encodeURIComponent(item.path));
      this.update();
    },

    mkdir: function (path) {
      var p = prompt('New folder');
      if (!p) return;

      $.ajax({
        url: '/mkdir/' + encodeURIComponent(path + '/' + p),
        type: 'POST',
        async: false,
      });

      this.update();
    }
  };
};


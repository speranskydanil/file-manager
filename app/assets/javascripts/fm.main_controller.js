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
      var self = this;

      Message.confirm({
        title: 'Delete',
        content: 'Are you sure?',
        callback: function (response) {
          if (response) {
            $.each(items, function (i, item) {
              $.ajax({
                url: '/remove/' + encodeURIComponent(item.path),
                type: 'POST',
                async: false,
              });
            });

            self.update();
          }
        }
      });
    },

    rename: function (item) {
      var self = this;

      Message.prompt({
        title: 'Rename',
        content: 'Enter the new name',
        callback: function (response) {
          if (response) {
            $.ajax({
              url: '/rename/' +
                   encodeURIComponent(item.path) +
                   '/' +
                   encodeURIComponent(response),
              type: 'POST',
              async: false,
            });

            self.update();
          }
        },
        value: item.name
      });
    },

    zip: function (item) {
      var self = this;

      Message.prompt({
        title: 'Zip',
        content: 'Enter the zip name',
        callback: function (response) {
          if (response) {
            $.ajax({
              url: '/zip/' +
                   encodeURIComponent(item.path) +
                   '/' +
                   encodeURIComponent(response),
              type: 'POST',
              async: false,
            });

            self.update();
          }
        },
        value: item.name
      });
    },

    unzip: function (item) {
      var self = this;

      Message.prompt({
        title: 'Unzip',
        content: 'Enter the directory name',
        callback: function (response) {
          if (response) {
            $.ajax({
              url: '/unzip/' +
                   encodeURIComponent(item.path) +
                   '/' +
                   encodeURIComponent(response),
              type: 'POST',
              async: false,
            });

            self.update();
          }
        },
        value: item.name.replace('.zip', '')
      });
    },

    download: function (item) {
      window.open('/download/' + encodeURIComponent(item.path));
      this.update();
    },

    mkdir: function (path) {
      var self = this;

      Message.prompt({
        title: 'New directory',
        content: 'Enter the directory name',
        callback: function (response) {
          if (response) {
            $.ajax({
              url: '/mkdir/' + encodeURIComponent(path + '/' + response),
              type: 'POST',
              async: false,
            });

            self.update();
          }
        },
        value: 'New directory'
      });
    }
  };
};


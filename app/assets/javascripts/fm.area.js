FM.Area = function (selector, main_controller) {
  var Model = {
    base_dir: function () {
      if (this.base_dir.cache) return this.base_dir.cache;

      var self = this;

      $.ajax({
        url: '/base_dir',
        dataType: 'text',
        async: false,
        success: function (response) {
          self.base_dir.cache = response;
        }
      });

      return this.base_dir.cache;
    },

    cur_dir: function (path) {
      if (path) {
        this.cur_dir.cache = path;
      } else {
        if (this.cur_dir.cache) return this.cur_dir.cache;

        this.cur_dir.cache = this.base_dir();
        return this.cur_dir.cache;
      }
    },

    move: function (inx) {
      this.cur_dir(this.item(inx).path);
    },

    up: function () {
      this.cur_dir(new Path(this.cur_dir()).dirname().toString());
    },

    list: function (update) {
      if (!update && this.list.cache) return this.list.cache;

      var self = this;

      $.ajax({
        url: '/list/' + encodeURIComponent(this.cur_dir()),
        dataType: 'json',
        async: false,
        success: function (list) {
          self.list.cache = list.sort(function (a, b) {
            if (self.is_directory(a) == self.is_directory(b)) {
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            } else {
              return self.is_directory(a) ? -1 : 1;
            }
          });
        }
      });

      return this.list.cache;
    },

    item: function (inx) {
      return this.list()[inx];
    },

    items: function (inxs) {
      var self = this;

      return $.map(inxs, function (inx) {
        return self.item(inx);
      });
    },

    text: function (inx) {
      var item = this.item(inx);

      var text;

      $.ajax({
        url: '/read/' + encodeURIComponent(item.path),
        dataType: 'text',
        async: false,
        success: function (response) {
          text = response;
        }
      });

      return { name: item.name, text: text };
    },

    is_directory: function (item) {
      return item.type == 'inode/directory; charset=binary';
    },

    is_text: function (item) {
      return !!item.type.match(/text/);
    },

    is_image: function (item) {
      var image_types = ['image/jpeg; charset=binary', 'image/png; charset=binary'];
      return image_types.indexOf(item.type) > -1;
    },

    is_audio: function (item) {
      var audio_types = ['audio/mpeg; charset=binary'];
      return audio_types.indexOf(item.type) > -1;
    },

    is_video: function (item) {
      var video_types = ['video/mp4; charset=binary'];
      return video_types.indexOf(item.type) > -1;
    },

    is_media: function (item) {
      return this.is_image(item) ||
             this.is_audio(item) ||
             this.is_video(item);
    },

    is_zip: function (item) {
      return item.type == 'application/zip; charset=binary';
    },

    hf: false
  };

  var Controller = {
    index: function (inx) {
      if (inx == 'up') {
        Model.up();
        inx = undefined;
      }

      if (inx == 'hf') {
        Model.hf = !Model.hf;
        inx = undefined;
      }

      if (inx != undefined) Model.move(inx);

      View.index(Model.list(true));
    },

    cut: function (inxs) {
      main_controller.cut(Model.items(inxs));
    },

    copy: function (inxs) {
      main_controller.copy(Model.items(inxs));
    },

    paste: function () {
      main_controller.paste(Model.cur_dir());
    },

    delete: function (inxs) {
      main_controller.delete(Model.items(inxs));
    },

    rename: function (inx) {
      main_controller.rename(Model.item(inx));
    },

    zip: function (inx) {
      main_controller.zip(Model.item(inx));
    },

    unzip: function (inx) {
      main_controller.unzip(Model.item(inx));
    },

    download: function (inx) {
      main_controller.download(Model.item(inx));
    },

    show_text: function (inx) {
      var response = Model.text(inx);
      View.show_text(response.name, response.text);
    },

    show_media: function (inx) {
      View.show_media(Model.item(inx));
    },

    mkdir: function () {
      main_controller.mkdir(Model.cur_dir());
    }
  };

  var View = {
    selector: selector,

    index: function (list) {
      var area = $(this.selector);
      area.disableSelection();

      area.find('.cur-dir').text(Model.cur_dir());

      this.build_toolbar();

      area.find('table').remove();

      area.find('.area-table').append(
        '<table class="table"><thead><tr>' +
          '<th data-sort="string">Name</th>' +
          '<th data-sort="int">Size</th>' +
          '<th data-sort="string">Mode</th>' +
          '<th data-sort="string">Update Time</th>' +
        '</tr></thead><tbody></tbody></table>'
      );

      for (var i = 0, l = list.length; i < l; i++) {
        var item = list[i];

        if (!Model.hf && item.name[0] == '.') continue;

        if (Model.is_directory(item)) {
          var icon = '<span class="glyphicon glyphicon-folder-open"></span>';
        } else {
          var icon = '<span class="glyphicon glyphicon-file"></span>';
        }

        icon += '&nbsp;&nbsp;&nbsp;&nbsp';

        var tr = $('<tr data-inx="' + i + '">' +
                     '<td data-sort-value="' + i + '">' + icon + item.name + '</td>' +
                     '<td data-sort-value="' + item.bsize + '">' + item.size + '</td>' +
                     '<td>' + item.mode + '</td>' +
                     '<td>' + item.ctime + '</td>' +
                   '</tr>');

        area.find('tbody').append(tr);
      }

      var self = this;

      $(document)
        .off('click.areatr', selector + ' tbody tr')
        .on('click.areatr', selector + ' tbody tr', function (e) {
        var tr = $(this);

        var inx = tr.data('inx');
        var item = Model.item(inx);

        if (tr.hasClass('active')) {
          if (Model.is_directory(item)) {
            Controller.index(inx);
          } else if (Model.is_text(item)) {
            Controller.show_text(inx);
          } else if (Model.is_media(item)) {
            Controller.show_media(inx);
          } else {
            self.message('the file is not readable');
          }
        } else {
          if (!e.ctrlKey) {
            tr.parent().children().removeClass('active');
          }

          tr.addClass('active');
        }
      });

      area.find('table').stupidtable();

      $(window).trigger('resize.area');

      $.contextMenu({
        selector: selector + ' tbody tr',

        items: {
          cut: {
            name: 'Cut',
            icon: 'cut',
            callback: function (key, opt) {
              Controller.cut(
                area.find('.active').add(this).map(function () {
                  return $(this).data('inx');
                }).get()
              );
            }
          },

          copy: {
            name: 'Copy',
            icon: 'copy',
            callback: function (key, opt) {
              Controller.copy(
                area.find('.active').add(this).map(function () {
                  return $(this).data('inx');
                }).get()
              );
            }
          },

          paste: {
            name: 'Paste',
            icon: 'paste',
            callback: function (key, opt) {
              Controller.paste();
            },
            disabled: function () {
              return !main_controller.with_buffer();
            }
          },

          delete: {
            name: 'Delete',
            icon: 'delete',
            callback: function (key, opt) {
              Controller.delete(
                area.find('.active').add(this).map(function () {
                  return $(this).data('inx');
                }).get()
              );
            }
          },

          rename: {
            name: 'Rename',
            icon: 'edit',
            callback: function (key, opt) {
              Controller.rename($(this).data('inx'));
            }
          },

          zip: {
            name: 'Zip',
            icon: 'zip',
            callback: function (key, opt) {
              Controller.zip($(this).data('inx'));
            }
          },

          unzip: {
            name: 'Unzip',
            icon: 'unzip',
            callback: function (key, opt) {
              Controller.unzip($(this).data('inx'));
            },
            disabled: function () {
              var item = Model.item($(this).data('inx'));
              return !Model.is_zip(item);
            }
          },

          download: {
            name: 'Download',
            icon: 'download',
            callback: function (key, opt) {
              Controller.download($(this).data('inx'));
            },
            disabled: function () {
              var item = Model.item($(this).data('inx'));
              return Model.is_directory(item);
            }
          }
        }
      });
    },

    build_toolbar: function () {
      var area = $(this.selector);

      area.find('.toolbar').empty();

      area.find('.toolbar').append('<div class="bw"><button class="btn btn-default btn-sm up">Up</button></div>');

      area.find('.toolbar .up').click(function () {
        if (Model.cur_dir() != Model.base_dir()) Controller.index('up');
      });

      if (Model.cur_dir() == Model.base_dir()) area.find('.toolbar .up').attr('disabled', 'disabled');

      area.find('.toolbar').append('<div class="bw"><button class="btn btn-default btn-sm update">Update</button></div>');

      area.find('.toolbar .update').click(function () {
        Controller.index();
      });

      area.find('.toolbar').append('<div class="bw"><button class="btn btn-default btn-sm hf">Hidden files</button></div>');

      area.find('.toolbar .hf').click(function () {
        Controller.index('hf');
      });

      if (Model.hf) area.find('.toolbar .hf').addClass('active');

      area.find('.toolbar').append('<div class="bw"><button class="btn btn-default btn-sm nf">New folder</button></div>');

      area.find('.toolbar .nf').click(function () {
        Controller.mkdir();
      });
    },

    show_text: function (name, text) {
      Message.alert({
        title: name,
        content: '<pre>' + text + '</pre>',
        size: 'large'
      });
    },

    show_media: function (item) {
      var src = '/read/' + encodeURIComponent(item.path);

      if (Model.is_image(item)) {
        var html = '<img src="' + src + '">';
      }

      if (Model.is_audio(item)) {
        var html = '<audio controls><source src="' +
                   src +
                   '">Your browser does not support the audio tag.</audio>';
      }

      if (Model.is_video(item)) {
        var html = '<video controls><source src="' +
                   src +
                   '">Your browser does not support the video tag.</video>';
      }

      Message.alert({
        title: item.name,
        content: html,
        size: 'large'
      });
    },

    message: function (text) {
      $('.fm-message').remove();

      var msg = $('<div class="fm-message">').text(text).hide().appendTo('body');

      msg.fadeIn(function () {
        $(this).delay(2000).fadeOut(function () {
          $(this).remove();
        });
      });
    }
  };

  Controller.index();

  $(window).unbind('resize.area').bind('resize.area', function () {
    $('.fm .area tbody').each(function () {
      $(this).height(
        Math.max($(this).height() + $(window).height() - $('html').height() - 10, 200)
      );
    });
  });

  $(window).trigger('resize.area');

  return {
    Model: Model,
    Controller: Controller,
    View: View
  };
};


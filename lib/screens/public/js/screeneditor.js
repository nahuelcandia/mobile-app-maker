/*
 * Extensive use of https://github.com/jpillora/jquery.rest
 */
$(function() {
  screeneditor();
});

function screeneditor() {
  if (!(this instanceof screeneditor)) {
    return new screeneditor();
  }
  this.editor = this.initEditor();
  this.client = new $.RestClient("/admin/");
  this.client.add("screens");
  this.initSaveButton();
  this.initDestroyButton();
}

screeneditor.prototype = {
  initSaveButton: function() {
    var _this = this;
    $("#save").on("click", function() {
      _this.saveScreen();
      return false;
    });
  },

  initDestroyButton: function() {
    var _this = this;
    $("#destroyScreenButton").on("click", function() {
      _this.destroyScreen();
      return false;
    });
  },
  getScreenData: function() {
    return {
      title: $("[name=title]").val(),
      position: parseInt($("[name=position]").val(), 10),
      id: $("[name=id]").val(),
      content: this.editor.getHTML(),
      showinmenu: $("[name=showinmenu]").is(":checked")
    };
  },
  getCurrentId: function() {
    var currentId = $("[name=currentId]").val();
    return currentId;
  },
  saveScreen: function() {
    var id = this.getCurrentId()
    data = this.getScreenData();
    this.client.screens.update(id, data)
      .done(function() {
        if (data.id !== id) {
          window.location = "/admin/screens/" + data.id;
        }
      }).fail(function() {
        alert("error saving");
      });
  },

  destroyScreen: function() {
    var id = this.getCurrentId(),
      data = this.getScreenData();
    var confirmed = confirm("You are about to remove this screen from the app permanently");
    if (confirmed) {
      this.client.screens.destroy(id)
        .done(function() {
          window.location = "/admin/screens";
        }).fail(function() {
          alert("Error remove this screen from the app");
        });
    }
  },

  initEditor: function() {
    var basicEditor = new Quill('#screen', {
      modules: {
        toolbar: {
          container: "#editortoolbar"
        }
      },
      theme: "snow"
    });
    return basicEditor;
  }
};
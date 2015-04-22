/* #License 
 *
 * The MIT License (MIT)
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 *
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

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
      content: this.editor.getHTML()
    };
  },
  getCurrentId: function() {
    var currentId = $("[name=currentId]").val();
    return currentId;
  },
  saveScreen: function() {
    var id = this.getCurrentId()
    data = this.getScreenData();
    console.log(id);
    console.log(data);
    this.client.screens.update(id, data)
      .done(function() {
        if (data.id !== id) {
          window.location = "/admin/screens/" + data.id;
        } else {
          window.location = "/admin/screens/";
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
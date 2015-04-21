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
  menueditor();
});

function menueditor() {
  if (!(this instanceof menueditor)) {
    return new menueditor();
  }
  this.client = new $.RestClient("/admin/");
  this.client.add("menus");
  this.initSaveButton();

}

menueditor.prototype = {
  initSaveButton: function() {
    var _this = this;
    $(document).on("click", "#saveMenus", function() {
      _this.saveMenus();
      return false;
    });

  },
  getMenusData: function() {
    var newMenusList = [];

    var tables = $("table");

    for (var i = 0; i < tables.length; i++) {

      var rows = tables.eq(i).find("tbody tr:not(.new)");

      for (var j = 0; j < rows.length; j++) {
        var state;
        var icon;
        if (rows.eq(j).find(".state").hasClass('publish')) {
          state = 'enabled';
        } else {
          state = 'disabled';
        }
        if (rows.eq(j).find(".iconId").html() == 'Select icon') {
          icon = "none";
        } else {
          icon = rows.eq(j).find(".iconId:first").html();
        }
        newMenusList.push({
          title: rows.eq(j).find(".title:first").val(),
          type: rows.eq(j).find(".selectType:first").val(),
          screenID: rows.eq(j).find(".screenId:first").val(),
          icon: icon,
          menu: tables.eq(i).data("menu"),
          position: rows.eq(j).data("position"),
          state: state
        });
      }
    }
    console.log(newMenusList);
    return newMenusList;
  },
  saveMenus: function() {
    var _this = this;
    var newMenusList = this.getMenusData();
    _this.client.menus.read().done(function(data) {
      var prevMenuList = data[0];
      for (menu in prevMenuList) {
        _this.client.menus.del(prevMenuList[menu]._id);
      }
      for (menu in newMenusList) {
        _this.client.menus.create(newMenusList[menu]);
      }

      alert("Save!");
    });
  }
};
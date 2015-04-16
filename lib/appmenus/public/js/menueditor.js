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

    for(var i = 0; i < tables.length; i++)
    {
      var rows = tables.eq(i).find("tbody tr:not(.new)");

      for(var j = 0; j < rows.length; j++)
      {
         newMenusList.push({
            title: rows.eq(j).find(".title:first").val(),
            screenID: rows.eq(j).find(".screenId:first").val(),
            icon: rows.eq(j).find(".iconId:first").val(),
            menu: tables.eq(i).data("menu"),
            position: rows.eq(j).data("position")
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
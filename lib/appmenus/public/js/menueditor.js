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
    $("#saveMenus").on("click", function() {
      _this.saveMenus();
      return false;
    });
  },
  getMenusData: function() {
    var newMenusList = [];
    $("#tableTabbar tbody").children().each(function(index) {
      var newMenu = {};
      newMenu.title = $(this).find(".inputTitle").val();
      newMenu.screenID = $(this).find(".selectScreenID").val();
      newMenu.icon = $(this).find(".selectIcon").val();
      newMenu.menu = "tabbar";
      newMenu.position = index + 1;
      if ($(this).find(".state").hasClass('ion-eye')) {
        newMenu.state = 'enabled';
      } else {
        newMenu.state = 'disabled';
      }
      newMenusList.push(newMenu);
    });
    newMenusList.pop();
    $("#tableSidemenu tbody").children().each(function(index) {
      var newMenu = {};
      newMenu.title = $(this).find(".inputTitle").val();
      newMenu.screenID = $(this).find(".selectScreenID").val();
      newMenu.icon = $(this).find(".selectIcon").val();
      newMenu.menu = "sidemenu";
      newMenu.position = index + 1;
      if ($(this).find(".state").hasClass('ion-eye')) {
        newMenu.state = 'enabled';
      } else {
        newMenu.state = 'disabled';
      }
      newMenusList.push(newMenu);
    });
    newMenusList.pop();
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
    });
  }
};
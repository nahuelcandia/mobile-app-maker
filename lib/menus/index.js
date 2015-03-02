module.exports = menumodule;

function menumodule(app) {
  var menus = {};
  menus.admin = [];
  app.locals.menus = menus;
  return menus;
}
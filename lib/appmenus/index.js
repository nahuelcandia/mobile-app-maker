var debug = require("debug")("cms:menus"),
  db = require(process.cwd() + "/lib/db"),
  express = require("express"),
  resolve = require("path").resolve,
  api = require("./api"),
  appmenus = db.get("appmenus");

module.exports = function(app) {
  app.use("/admin/menus", api(appmenus));
  app.use("/admin/menus/js", express.static(resolve(__dirname, "public", "js")));
  app.use("/admin/menus/css", express.static(resolve(__dirname, "public", "css")));
  // Hook to rendering.
  setMenusAsLocals(app);
  // Inset menut items in the admin backend sidebar
  setMenusMenuItem(app);

};

function setMenusMenuItem(app) {
  app.cms.menus.registerAdminMenu({
    title: "App menus",
    href: "/admin/menus",
    icon: "ion-monitor",
    weight: app.cms.menus.lightestAdminMenuItem() - 1
  });
}

function setMenusAsLocals(app) {

  app.cms.frontend.hook("beforerender", function(locals, next) {
    appmenus.find({}).sort({
      position: 1
    }).exec(function(err, menuslist) {
      if (err) {
        return debug("Error", err);
      }
      locals.appmenus = menuslist;
      next();
    });

  });

}
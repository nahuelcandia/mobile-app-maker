var debug = require("debug")("cms:screens"),
  db = require(process.cwd() + "/lib/db"),
  api = require("./api"),
  screens = db.get("screens");

module.exports = function(app) {
  app.use("/admin/screens", api(screens));
  // Hook to rendering.
  setScreensAsLocals(app);
  // Inset menut items in the admin backend sidebar
  setScreensMenuItem(app);

};

function setScreensMenuItem(app) {
  app.cms.menus.admin.push({
    title: "App screens",
    href: "/admin/screens"
  });
}

function setScreensAsLocals(app) {

  app.cms.frontend.hook("beforerender", function(locals, next) {
    screens.find({}, function(err, screenslist) {
      if (err) {
        return debug("Error", err);
      }
      locals.screens = screenslist;
      next();
    });

  });

}
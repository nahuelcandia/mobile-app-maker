var express = require("express"),
  join = require("path").join,
  editor = require("./editables"),
  debug = require("debug")("cms:admin"),
  plugins = require("./plugins"),
  templates = require("./templates"),
  apps = require("./apps");

module.exports = admin;


/**
 * Creates route for admin panel home and browser client codee
 *
 * @param {express.App} express request handler
 */
function admin(app) {
  // Load admin modules

  plugins(app);
  templates(app);
  apps(app);
  editor(app);
  app.get("/admin", function(req, res, next) {
    adminHome(req, res, next, app);
  });
  // Serve browser client shovelapps-cms.js 
  app.use("/shovelapps", express.static(join(__dirname, "client/shovelapps")));

}
/**
 * Middleware for serving admin panel's home
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 * @param {express.App} express request handler.
 */
function adminHome(req, res, next, app) {
  res.render("../admin/admin-home", {
    plugins: app.locals.plugins
  });
  debug(app.locals.plugins);
}
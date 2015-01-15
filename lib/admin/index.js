var express = require("express");
var join = require("path").join;
var db = require("../db");
var editor = require("./editables");
var debug = require("debug")("cms:admin");
var plugins = require("./plugins");
module.exports = admin;

/**
 * Creates route for admin panel home and browser client codee
 * 
 * @param {express.App} express request handler
 *   - {Socket} 
 */
function admin(app) {
  app.get("/admin", function(req, res, next) {
    adminHome(req, res, next, app);
  });
  // Serve browser client shovelapps-cms.js 
  app.use("/shovelapps", express.static(join(__dirname, "client/shovelapps")));
  // Load admin modules
  plugins(app);
  editor(app);
}
/**
 * Middleware for serving admin panel's home
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 * @param {express.App} express request handler.
 *   - {Socket}
 */
function adminHome(req, res, next, app) {
  res.render("../admin/admin-home", {
    plugins: app.locals.plugins
  });
  debug(app.locals.plugins);
}
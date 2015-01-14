var express = require("express");
var join = require("path").join;
var db = require("../db");
var editor = require("./editables");
var debug = require("debug")("cms:admin");
var plugins = require("./plugins");
module.exports = admin;


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

function adminHome(req, res, next, app) {
  res.render("../admin/admin-home", {
    plugins: app.locals.plugins
  });
  debug(app.locals.plugins);
}
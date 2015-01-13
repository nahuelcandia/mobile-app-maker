var express = require("express");
var join = require("path").join;
var datacollections = require("../db").datacollections;
var editor = require("./editables");
var debug = require("debug")("cms:admin");

var dataCollectionEditor = require("./datacollection-editor");
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
  dataCollectionEditor(app);
  editor(app);
}

function adminHome(req, res, next, app) {
  datacollections.all(function(err, datacollections) {
    res.render("../admin/admin-home", {
      datacollections: datacollections,
      plugins: app.locals.plugins
    });
    debug(app.locals.plugins);
  });

}
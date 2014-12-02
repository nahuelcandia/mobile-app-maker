var datacollections = require("../db").datacollections;
var editor = require("./editables");

var dataCollectionEditor = require("./datacollection-editor");
module.exports = admin;


function admin(app) {
  app.get("/admin", function(req, res, next) {
    adminHome(req, res, next);
  });
  dataCollectionEditor(app);
  editor(app);
}

function adminHome(req, res, next) {
  datacollections.all(function(err, datacollections) {
    res.render("../admin/admin-home", {
      datacollections: datacollections
    });
  })


}
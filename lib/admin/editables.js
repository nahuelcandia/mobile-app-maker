var db = require("../db");
var debug = require("debug")("cms:editables");

module.exports = function(app) {

  app.post("/admin/editable", function(req, res) {
    debug("Tried to save editable %s", req.param("id"));
    db.editables.saveEdition({
      id: req.param("id"),
      html: req.param("html")
    }, function() {
      res.send("hola");
    });
  });
};
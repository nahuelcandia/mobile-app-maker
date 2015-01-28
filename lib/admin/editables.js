var db = require("../db");
var debug = require("debug")("cms:editables");
/**
 * Registers URL routes for handling saving of an editable's content
 *
 * @param {express.App} express request handler.
 */
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
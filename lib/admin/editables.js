var db = require("../db"),
  debug = require("debug")("cms:editables"),
  cheerio = require("cheerio");
/**
 * Registers URL routes for handling saving of an editable's content
 *
 * @param {express.App} express request handler.
 */
module.exports = function(app) {
  app.cms.frontend.hook("afterrender", function(rendered, locals, next) {
    db.editables.all(function(err, updatedEditables) {
      if (err) {
        debug("Error finding editables", err);
        next(err);
      }
      rendered.html = replaceEditables(rendered.html, updatedEditables);
      next();
    });
  });
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

function replaceEditables(html, editables) {
  var a = editables.reduce(function(obj, cur) {
    obj[cur.editableId] = cur;
    return obj;
  }, {});
  var $ = cheerio.load(html);

  // Replace all data-editable elements
  // with the last stored HTML for that element
  $("[data-editable!=''][data-editable]").each(function() {
    var editableId = $(this).attr("data-editable");
    // For all data-editables declared on the template
    // but are unmodified by the user
    if (a[editableId]) {
      $(this).html(a[editableId].html);
    }
  });
  return $.html();
}
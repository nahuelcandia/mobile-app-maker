var debug = require("debug")("cms:template"),
  config = require("config"),
  join = require("path").join,
  paths = config.get("paths"),
  templates = require("../db").templates;

module.exports = template;
/**
 * - Sets default express template engine to `jade`.
 * - Sets pretty output for jade if we are in development environment
 * - Sets default views path for express as an array in order to allow
 *
 * @param {express.App} express request handler
 */
function template(app, templateName) {
  // Set default engine. If not, user gets this message when
  // no extension is provided

  app.set("template", config.get("template"));
  if (typeof templateName === "undefined") {
    var templateName = config.get("template");
    templates.find({
      enabled: 1
    }, function(err, docs) {
      if (docs.length === 1) {
        templateName = docs[0].name;
        console.log(docs[0].name);
      }
    });
  }
  console.log(templateName);
  try {
    var index = require('../../templates/' + templateName + '/index.js');
    app.locals.templates[templateName].index = index;
    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      //debug("Calling plugin %s index function (i.e. module.exports=function())", k);
      try {
        app.locals.templates[templateName].index(app, server, sockets);
      } catch (e) {
        debug("Template index function errored", e);
        console.warn("Error trying to load template '%s'. The error was: %s", k, e.toString());
        debug(e);
      }
    }
  } catch (e) {
    debug("Couldn't load 'index.js' for template '%s'");
    debug(e);
  }

  // No default engine was specified and no extension was provided.
  app.set("view engine", "jade");

  app.engine("html", require("ejs").renderFile);

  //Make jade output pretty
  if (app.get("env") === "development") {
    app.locals.pretty = true;
  }
  // Set template
  app.set("template", templateName);
  var templatePath = join(paths.templatesBase, app.get("template"));

  app.set("views", [templatePath]);

}
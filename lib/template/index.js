var debug = require("debug")("cms:template"),
  config = require("config"),
  join = require("path").join,
  path = require("path"),
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
  template.requireTemplate(app, app.cms.server, app.cms.sockets, app.locals.templates, templateName);

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

template.requireTemplate = function(app, server, sockets, templates, tpl) {
  debug(arguments);
  try {
    debug("Trying to load index.js from '%s' template's directory as a module", tpl);
    var index = require('../../templates/' + tpl + '/index.js');
    //templates[tpl].index = index;

    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      try {
        debug("Calling template '%s' exported function (i.e. module.exports=function())", tpl);
        index(app, server, sockets);
      } catch (e) {
        console.warn("Error calling template '%s' index function . The error was: %s", tpl, e.toString());
        console.warn(e.stack);
      }
    } else {
      debug("The index.js inside the template directory does not export a function");
    }

  } catch (e) {
    if ("MODULE_NOT_FOUND" === e.code) {
      debug("This template has no 'index.js' inside");
    } else {
      console.warn("Couldn't load 'index.js' for template '%s'", path.basename(path));
      console.warn(e.stack);
    }
  }
}
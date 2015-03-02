var debug = require("debug")("cms:template"),
  config = require("config"),
  join = require("path").join,
  paths = config.get("paths");

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
  if (typeof templateName === "undefined") {
    templateName = config.get("template");
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
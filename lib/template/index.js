var express = require("express"),
  path = require("path"),
  debug = require("debug")("cms:template"),
  extend = require("extend"),
  config = require("config");

var options = {
  basePath: config.get("paths").templatesBasePath,
  currentTemplate: config.get("template")
};

options = extend(options, options.currentTemplate);

module.exports = template;
/**
 * - Sets default express template engine to `jade`.
 * - Sets pretty output for jade if we are in development environment
 * - Sets default views path for express as an array in order to allow
 * - Handles static routes  /assets for the assets folder inside the templates
 * -Handles static routes admin / assets
 for the assets folder inside the admin template
 *
 * @param {express.App} express request handler
 */
function template(app, templateName) {
  // Set default engine. If not, user gets this message when
  // no extension is provided
  templateName = (typeof templateName === 'undefined' ? options.currentTemplate : templateName);

  // No default engine was specified and no extension was provided.
  app.set("view engine", "jade");

  app.engine('html', require('ejs').renderFile);

  //Make jade output pretty
  if (app.get('env') === 'development') {
    app.locals.pretty = true;
  }
  // Set template
  app.set("template", templateName);
  var templatePath = path.join(process.cwd(), "templates", app.get("template"));
  debug("Available plugins on template module are %j", app.plugins);

  app.set("views", [templatePath]);

  // var pluginsViewPaths = Object.keys(app.plugins).map(function(k, v) {
  //   if (app.plugins[k].views) {
  //     return app.plugins[k].views;
  //   }
  // }).filter(function(path) {
  //   return (path !== undefined);
  // });
  // debug("Additional view paths found on plugins are %j", [templatePath].concat(pluginsViewPaths));
  // debug("Engine: %j", app);
  // // Set views path
  // app.set('views', [templatePath].concat(pluginsViewPaths));


  app.use("/assets", express.static(path.join(templatePath, "/assets")));
  app.use("/", express.static(path.join(templatePath, "/")));
  app.use("/coreassets", express.static(path.join(templatePath, "../admin/assets")));
}
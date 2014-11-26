var express = require("express"),
  path = require("path"),
  debug = require("debug")("cms:template"),
  extend = require("extend");
config = require("config");

var options = {
  basePath: "templates"
}

options = extend(options, config.get("template"));

module.exports = template

function template(app) {
  // Set default engine. If not, user gets this message when
  // no extension is provided

  // No default engine was specified and no extension was provided.
  app.set("view engine", "jade");

  //Make jade output pretty
  if (app.get('env') === 'development') {
    app.locals.pretty = true;
  }
  // Set template
  app.set("template", config.get("template"));
  var templatePath = path.join(process.cwd(), "templates", app.get("template"));
  // Set views path
  app.set('views', templatePath);
  console.log(templatePath);
  app.use("/assets", express.static(path.join(templatePath, "/assets")))
  app.use("/coreassets", express.static(path.join(templatePath, "../admin/assets")))
}

template.loadConfig = function(callback) {
  var templateConfig = {
    basePath: path.join(process.cwd(), options.basePath,
      config.get("template")),
    assetsPath: "./assets",
    engine: "jade"
  };
  callback(templateConfig);
}
var config = require("config"),
  debug = require("debug")("cms:installer");

module.exports = install;

var installed = config.get("installed");

function install(app) {
  debug("The CMS is %s installed.", installed ? "" : "not");
  app.use(showInstallerIfNotInstalled);
  // Handle installer route
  // It's the only one available if not installed
  app.get("/installer", installer)
}

function showInstallerIfNotInstalled(req, res, next) {

  if (req.path === "/installer") {
    next();
  }
  if (!installed) {
    return res.redirect("/installer");
  }
  next();
}

function installer(req, res, next) {
  res.render("installer");
}
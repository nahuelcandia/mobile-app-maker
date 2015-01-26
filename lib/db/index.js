var config = require("config"),
  sprintf = require("sprintf"),
  debug = require("debug")("cms:db"),
  store = require("nedb");

module.exports = getdb();

//file based
function getdb() {
  var db = {};

  var users = new store({
    filename: "./filestorage/db/users.json",
    autoload: true
  });
  plugins = new store({
    filename: "./filestorage/db/plugins.json",
    autoload: true
  });
  editables = new store({
    filename: "./filestorage/db/editables.json",
    autoload: true
  });
  templates = new store({
    filename: "./filestorage/db/templates.json",
    autoload: true
  });
  apps = new store({
    filename: "./filestorage/db/apps.json",
    autoload: true
  });
  builds = new store({
    filename: "./filestorage/db/builds.json",
    autoload: true
  });
  db.users = require("./users")(users);
  db.plugins = require("./plugins")(plugins);
  db.editables = require("./editables")(editables);
  db.templates = require("./templates")(templates);
  db.apps = require("./apps")(apps);
  db.builds = require("./builds")(builds);
  return db;
}
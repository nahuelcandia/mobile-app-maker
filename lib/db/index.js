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
  var datacollections = new store({
    filename: "./filestorage/db/datacollections.json",
    autoload: true
  });
  builds = new store({
    filename: "./filestorage/db/builds.json",
    autoload: true
  });
  db.users = require("./users")(users);
  db.plugins = require("./plugins")(plugins);
  db.editables = require("./editables")(editables);
  db.datacollections = require("./datacollections")(datacollections);
  db.builds = require("./builds")(builds);
  return db;
}
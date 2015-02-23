var debug = require("debug")("cms:db"),
  join = require("path").join,
  store = require("nedb");

module.exports = getdb();

//file based
function getdb() {
  var db = {};
  debug("Creating db objects");
  var users = new store({
    filename: "./filestorage/db/users.db",
    autoload: true
  });
  var plugins = new store({
    filename: "./filestorage/db/plugins.db",
    autoload: true
  });
  var editables = new store({
    filename: "./filestorage/db/editables.db",
    autoload: true
  });
  var templates = new store({
    filename: "./filestorage/db/templates.db",
    autoload: true
  });
  var apps = new store({
    filename: "./filestorage/db/apps.db",
    autoload: true
  });
  var builds = new store({
    filename: "./filestorage/db/builds.db",
    autoload: true
  });
  db.users = require("./users")(users);
  db.plugins = require("./plugins")(plugins);
  db.editables = require("./editables")(editables);
  db.templates = require("./templates")(templates);
  db.apps = require("./apps")(apps);
  db.builds = require("./builds")(builds);
  db.get = get;
  return db;
}

function get(dbname) {
  var collection = new store({
    filename: join(process.cwd(), "filestorage", "db", dbname + ".db"),
    autoload: true
  });
  return collection;
}
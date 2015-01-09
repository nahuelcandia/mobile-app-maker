var store = require("nedb");

module.exports = getdb();

//file based
function getdb() {
  var db = {};

  var users = new store({
    filename: "./filestorage/db/users.json",
    autoload: true
  });

  var editables = new store({
    filename: "./filestorage/db/editables.json",
    autoload: true
  });
  var datacollections = new store({
    filename: "./filestorage/db/datacollections.json",
    autoload: true
  });
  db.users = require("./users")(users);
  db.editables = require("./editables")(editables);
  db.datacollections = require("./datacollections")(datacollections);
  return db;
}
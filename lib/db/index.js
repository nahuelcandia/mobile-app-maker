/* #License 
 *
 * The MIT License (MIT)
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 *
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

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
  var themes = new store({
    filename: "./filestorage/db/themes.db",
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
  db.themes = require("./themes")(themes);
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
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

var fs = require("fs"),
  path = require("path"),
  util = require("util");

module.exports = function(session) {

  var JsonStore = function(options) {
    options = options || {};
    session.Store.call(this, options);

    var filename = options.filename ? options.filename : "express-sessions.json";
    var dir = options.path || __dirname;

    this._filename = path.join(dir, filename);

    var self = this;
    if (!fs.existsSync(this._filename)) {
      fs.writeFileSync(this._filename, "{}");
      self._sessions = {};
    } else {
      //no problem to be sync at startup time!
      //otherwise, it may startup uninitialized
      try {
        self._sessions = JSON.parse(fs.readFileSync(this._filename));
      } catch (e) {
        fs.writeFileSync(this._filename, "{}");
        self._sessions = {};
      }
    }
  };

  util.inherits(JsonStore, session.Store);

  JsonStore.prototype.set = function(sid, sess, fn) {
    // find one
    sess._sessionid = sid;
    this._sessions[sid] = sess;
    fs.writeFile(this._filename, JSON.stringify(this._sessions), function(err) {
      fn(err, sess);
    });

  };

  JsonStore.prototype.get = function(sid, fn) {
    if (!this._sessions || !this._sessions[sid]) {
      fn(null, null);
    } else {
      fn(null, this._sessions[sid]);
    }
  };

  JsonStore.prototype.destroy = function(sid, fn) {
    if (!this._sessions || !this._sessions[sid]) {
      fn();
      return;
    }

    delete this._sessions[sid];

    // no big matter if have failed
    fs.writeFile(this._filename, JSON.stringify(this._sessions), fn);

    return;
  };

  JsonStore.prototype.length = function(fn) {
    if (!this._sessions || !this._sessions[sid])
      return 0;
    var i = 0;
    for (var x in this._sessions)
      if (this._sessions.hasOwnProperty(x))
        i++;
    return i;
  };

  JsonStore.prototype.all = function(fn) {
    var t = [];
    for (var x in this._sessions)
      t.push(this._sessions[x]);
    fn(null, t);
  };

  JsonStore.prototype.clear = function(fn) {
    this._sessions = {};

    fs.writeFile(this._filename, JSON.stringify(this._sessions), fn);

  };

  return JsonStore;
};
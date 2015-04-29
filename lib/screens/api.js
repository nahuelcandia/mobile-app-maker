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

var debug = require("debug")("cms:plugin:screens:api"),
  express = require("express"),
  join = require("path").join,
  resolve = require("path").resolve,
  db = require(process.cwd() + "/lib/db"),
  cheerio = require("cheerio"),
  randomid = require("simple-random-id");

module.exports = screensapi;

function screensapi(screens) {
  var adminThemePath = join(process.cwd(), "themes", "admin");
  var api = express.Router();

  // /screens
  api.route("/")
    .get(function(req, res) {
      screens.find({}).sort({
        position: 1
      }).exec(function(err, data) {
        res.format({
          "text/html": function() {
            //err ? res.send(err) : res.render(__dirname + "/views/index");
            if (err) {
              res.send(err);
            } else {
              data = data.map(function(screen) {
                var $ = cheerio.load(screen.content);
                screen.text = $($.html()).text();
                return screen;
              });
              res.render(resolve(__dirname, "index"), {
                screens: data
              });
            }
          },
          "application/json": function() {
            if (err) {
              return res.send(err);
            } else {
              res.json(data);
            }
          }
        });
      });
    })
    .post(function(req, res) {
      createNewScreen({}, function(err, newscreen) {
        err ? res.send(err) : res.json(newscreen);
      });
    });

  api.route("/new")
    .get(function(req, res) {
      createNewScreen({}, function(err, newscreen) {
        res.redirect("/admin/screens/" + newscreen.id);
      });
    });

  api.route("/:id/position")
    .patch(function(req, res, next) {
      screens.update({
        id: req.params.id
      }, {
        $set: {
          position: req.body.position
        }
      }, function(err, screen) {
        if (err) {
          return res.status(400).json(err);
        }
        if (!screen) {
          res.json('invalid screen id');
        }
        res.json(screen);
      });
    });

  // screens/:id
  api.route("/:id")
    .get(function(req, res, next) {
      screens.findOne({
        id: req.params.id
      }, function(err, screen) {
        if (err) {
          return res.status(500).send(err);
        }
        if (!screen) {
          return next();
        }
        res.render(resolve(__dirname, "screen.jade"), {
          screen: screen
        });
      })
    })
    .put(function(req, res) {
      screens.update({
        id: req.params.id
      }, req.body, function(err, screen) {
        if (err) {
          return res.status(400).json(err);
        }
        res.json(screen);
      });
      // DELETE /screens/:id
    }).delete(function(req, res) {
      screens.remove({
        id: req.params.id
      }, function(err, data) {
        if (err) {
          return res.status(500).json(err);
        }
        res.json(data);
      })
    });


  return api;

  function createNewScreen(data, callback) {
    var lastScreenPosition = 0;
    screens.find({}).sort({
      position: -1
    }).exec(function(err, docs) {
      if (docs.length > 0) {
        lastScreenPosition = parseInt(docs[0].position, 10);
        lastScreenPosition = lastScreenPosition + 1;
      }
      lastScreenPosition = lastScreenPosition.toString();
      screens.insert({
        id: "screen-" + randomid(5),
        position: lastScreenPosition,
        title: data.title || "New screen",
        content: data.content || "<b>Hi</b>"
      }, function(err, newscreen) {
        callback(err, newscreen);
      });
    });

  }
}
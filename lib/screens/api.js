var debug = require("debug")("cms:plugin:screens:api"),
  express = require("express"),
  join = require("path").join,
  resolve = require("path").resolve,
  db = require(process.cwd() + "/lib/db"),
  cheerio = require("cheerio"),
  randomid = require("simple-random-id");

module.exports = screensapi;

function screensapi(screens) {
  var adminTemplatePath = join(process.cwd(), "templates", "admin");
  var api = express.Router();

  // /screens
  api.route("/")
    .get(function(req, res) {
      screens.find({}, function(err, data) {
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

  api.use("/js", express.static(resolve(__dirname, "public", "js")));
  api.use("/css", express.static(resolve(__dirname, "public", "css")));

  return api;

  function createNewScreen(data, callback) {
    screens.insert({
      id: "screen-" + randomid(5),
      title: data.title || "New screen",
      showinmenu: data.showinmenu !== undefined ? data.showinmenu : false,
      content: data.content || "<b>Hi</b>"
    }, function(err, newscreen) {
      callback(err, newscreen);
    });
  }
}
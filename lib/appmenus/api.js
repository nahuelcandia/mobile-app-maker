var debug = require("debug")("cms:plugin:appmenus:api"),
  express = require("express"),
  join = require("path").join,
  resolve = require("path").resolve,
  db = require(process.cwd() + "/lib/db"),
  cheerio = require("cheerio"),
  randomid = require("simple-random-id");

module.exports = menusapi;

function menusapi(appmenus) {
  var adminTemplatePath = join(process.cwd(), "templates", "admin");
  var api = express.Router();

  // /appmenus
  api.route("/")
    .get(function(req, res) {
      var screens = db.get("screens");
      var icons = ["ion-monitor", "ion-play", "ion-images", "ion-map", "ion-gear-b"];
      screens.find({}).exec(function(err, datascr) {
        if (err) {
          throw err;
        }
        appmenus.find({}).sort({
          position: 1
        }).exec(function(err, data) {
          res.format({
            "text/html": function() {
              //err ? res.send(err) : res.render(__dirname + "/views/index");
              if (err) {
                res.send(err);
              } else {
                res.render(resolve(__dirname, "index"), {
                  appmenus: data,
                  screens: datascr,
                  icons: icons
                });
              }
            },
            "application/json": function() {
              if (err) {
                return res.send(err);
              } else {
                res.json([data]);
              }
            }
          });
        });
      });

    })
    .post(function(req, res) {
      createNewMenu(req.body, function(err, newappmenu) {
        err ? res.send(err) : res.json(newappmenu);
      });
    });

  // appmenus/:id
  api.route("/:id")
    .delete(function(req, res) {
      appmenus.remove({
        _id: req.params.id
      }, function(err, data) {
        if (err) {
          return res.status(500).json(err);
        }
        res.json(data);
      })
    });


  return api;

  function createNewMenu(data, callback) {
    appmenus.insert({
      title: data.title,
      screenID: data.screenID,
      icon: data.icon,
      menu: data.menu,
      position: data.position
    }, function(err, newscreen) {
      callback(err, newscreen);
    });


  }
}
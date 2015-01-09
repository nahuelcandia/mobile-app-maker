var db = require("../db");
var debug = require("debug")("cms:plugins");
var plugins = require("../db").plugins;

module.exports = function(app) {

  app.get("/admin/plugins", function(req, res, next) {
    debug("Accesed plugins page");
    db.plugins.all(function(err, docs) {
      var enabled = [];
      for (var index in docs) {
        enabled.push(docs[index].name)
      }
      debug(enabled);
      res.render("../admin/plugins", {
        plugins: app.locals.plugins,
        enabled: enabled
      });
    });
  });

  // validar req.params.name que matchee con app.locals.plugins

  app.get("/admin/plugin/:id", viewPlugin);
  app.get("/admin/plugin/:name", viewPlugin);
  app.get("/admin/plugin/delete/:name", deletePlugin);
  app.get("/admin/plugin/toggle/:name", togglePlugin);
  app.post("/admin/plugin/enable/:name", enablePlugin);
}

function deletePlugin(req, res, next) {
  plugins.remove({
    name: req.params.name
  }, function(err) {
    if (err) {
      return res.send(500, "I errored");
    }
    return res.send(200, "Deleted")
  });
}

function togglePlugin(req, res, next) {
  req.param.name
  var plugin = plugins.find({
    name: req.params.name
  }, function(err, docs) {
    if (docs.length == 1) {
      plugins.remove({
        name: req.params.name
      }, function(err) {
        if (err) {
          return res.send(500, "I errored");
        }
        return res.send(200, "Disabled!");
        debug('plugin disabled');
      });
    } else {
      plugins.insert({
        name: req.params.name,
        timestamp: Date.now()
      }, function(err) {
        if (err) {
          return res.send(500, "I errored");
        }
        return res.send(200, "Enabled!");
        debug('plugin enabled');
      });
    }
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });
}

function viewPlugin(req, res, next) {
  debug("Accesed plugin page");
  db.plugins.all(function(err, plugins) {
    res.render("../admin/plugins", {
      plugins: app.locals.plugins
    });
  });
}

function enablePlugin(req, res, next) {

}
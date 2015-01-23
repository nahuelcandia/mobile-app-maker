var db = require("../db");
var debug = require("debug")("cms:plugins");
var plugins = require("../db").plugins;
/**
 * Registers URL routes for altering plugins' state
 *
 * @param {express.App} express request handler.
 */
module.exports = function(app) {

  app.get("/admin/plugins", function(req, res, next) {
    debug("Accesed plugins page");
    db.plugins.all(function(err, docs) {
      res.render("../admin/components", {
        componentType: 'plugin',
        componentTypePlural: 'plugins',
        components: app.locals.plugins,
        states: docs
      });
      debug(docs);
      debug(app.locals.plugins);
    });
  });

  // validar req.params.name que matchee con app.locals.plugins

  app.get("/admin/plugin/:name", viewPlugin);
  app.get("/admin/plugin/delete/:name", deletePlugin);
  app.get("/admin/plugin/toggle/:name", togglePlugin);
  app.get("/admin/plugin/config/:name", getConfig);
  app.post("/admin/plugin/config/:name", setConfig);
}
/**
 * Middleware for handling the deletion of a plugin
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
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
/**
 * Middleware for handling the activation/deactivation of a plugin
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function togglePlugin(req, res, next) {
  req.param.name
  var plugin = plugins.find({
    name: req.params.name
  }, function(err, docs) {
    if (docs.length == 1) {
      plugins.update({
        name: req.params.name
      }, {
        $set: {
          enabled: (docs[0].enabled == 1 ? 0 : 1)
        }
      }, function(err) {
        if (err) {
          return res.send(500, "I errored");
        }
        var state = (docs[0].enabled == 1 ? 'disabled' : 'enabled');
        return res.type('application/json').status(200).send('{"state": "' + state + '", "key": "' + req.params.name + '"}');
        debug('plugin disabled');
      });
    } else {
      debug('plugin not found');
    }
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });
}
/**
 * Middleware for rendering the detailed view of a plugin
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function viewPlugin(req, res, next) {
  debug("Accesed plugin page: " + req.params.name);

  plugins.find({
    name: req.params.name
  }, function(err, docs) {
    res.render("../admin/component", {
      componentType: 'plugin',
      componentTypePlural: 'plugins',
      component: docs
    });
  });
}

function getConfig(req, res, next) {


}

function setConfig(req, res, next) {
  var name = req.param.name;
  var newConfig = req.body;
  return res.type('application/json').status(200).send('ok');
  //plugins.update({
  //  name: req.params.name
  //}, {
  //  "config": newConfig
  //}, function(err, docs) {
  //  debug(docs);
  //  res.state(200).send('done baby');
  //});
}
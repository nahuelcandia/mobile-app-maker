var db = require("../db"),
  debug = require("debug")("cms:plugins"),
  plugins = require("../db").plugins,
  bodyParser = require("body-parser");
/**
 * Registers URL routes for altering plugins' state
 *
 * @param {express.App} express request handler.
 */
module.exports = function(app) {

  app.get("/admin/plugins", function(req, res) {
    debug("Accesed plugins page");
    db.plugins.all(function(err, docs) {
      res.render("../admin/components", {
        componentType: 'plugin',
        componentTypePlural: 'plugins',
        components: app.locals.plugins,
        states: docs
      });
    });
  });

  // validar req.params.name que matchee con app.locals.plugins

  app.use(bodyParser.json());

  app.get("/admin/plugin/:name", viewPlugin);
  app.get("/admin/plugin/delete/:name", deletePlugin);
  app.get("/admin/plugin/toggle/:name", togglePlugin);
  app.get("/admin/plugin/config/:name", getConfig);
  app.post("/admin/plugin/config/:name", setConfig);
  app.get("/admin/plugins/:format", getPlugins);
};

function getPlugins(req, res) {
  var format = req.params.name;
  if (typeof format !== 'undefined') {
    format = (['json', 'csv'].indexOf(format) !== -1 ? format : 'json');
  }
  db.plugins.all(function(err, docs) {
    res.type('application/json').status(200).send(docs);
  });
}
/**
 * Middleware for handling the deletion of a plugin
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function deletePlugin(req, res) {
  plugins.remove({
    name: req.params.name
  }, function(err) {
    if (err) {
      return res.send(500, "I errored");
    }
    return res.send(200, "Deleted");
  });
}
/**
 * Middleware for handling the activation/deactivation of a plugin
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function togglePlugin(req, res) {
  plugins.find({
    name: req.params.name
  }, function(err, docs) {
    if (docs.length === 1) {
      plugins.update({
        name: req.params.name
      }, {
        $set: {
          enabled: (docs[0].enabled === 1 ? 0 : 1)
        }
      }, function(err) {
        if (err) {
          return res.send(500, "I errored");
        }
        var state = (docs[0].enabled === 1 ? 'disabled' : 'enabled');
        debug('plugin disabled');
        return res.type('application/json').status(200).send('{"state": "' + state + '", "key": "' + req.params.name + '"}');
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
function viewPlugin(req, res) {
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

function setConfig(req, res) {
  var newConfig = req.body;

  plugins.update({
    name: req.params.name
  }, {
    $set: {
      "config": newConfig
    }
  }, function(err) {
    debug(err);
    res.type('application/json').status(200).send('ok');
  });
}
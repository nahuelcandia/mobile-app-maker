var db = require("../db");
var debug = require("debug")("cms:apps");
var apps = require("../db").apps;
var bodyParser = require("body-parser");
/**
 * Registers URL routes for altering apps' state
 *
 * @param {express.App} express request handler.
 */
module.exports = function apps(app) {

  if (!(this instanceof apps)) {
    return new apps(app);
  }
  this.app = app;

  app.use(bodyParser.json());


  db.apps.find({}, function(err, docs) {
    app.locals.apps = docs;
  });

  app.get("/admin/apps", function(req, res) {
    debug("Accesed apps page");

    db.apps.find({}, function(err, docs) {
      app.locals.apps = docs;
      res.render("../admin/apps", {
        components: docs,
        availableApps: app.locals.config.availableApps,
        currentApps: app.locals.apps.length
      });
    });
  });


  app.get("/admin/app/:name", viewApp.bind(this));
  app.get("/admin/app/delete/:name", deleteApp);
  app.get("/admin/app/config/:name", getConfig);
  app.post("/admin/app/config/:name", setConfig);
};

/**
 * Middleware for handling the deletion of a app
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function deleteApp(req, res) {
  apps.remove({
    name: req.params.name
  }, function(err) {
    if (err) {
      return res.send(500, "I errored");
    }
    return res.send(200, "Deleted");
  });
}

/**
 * Middleware for rendering the detailed view of a app
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function viewApp(req, res, next) {
  debug("Accesed app page: " + req.params.name);
  var availableApps = this.app.locals.config.availableApps;
  var currentApps = this.app.locals.apps.length;
  debug(availableApps, currentApps);

  db.apps.find({
    name: req.params.name
  }, function(err, docs) {
    if (docs.length < 1 && availableApps > currentApps) {
      createApp(req, res, next);
    } else if (availableApps <= currentApps) {
      res.redirect("/admin/apps");
    } else {
      res.render("../admin/app", {
        component: docs
      });
    }
  });
}
/**
 * Middleware for rendering the app creating form
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function createApp(req, res) {
  debug("Accesed app creation page: " + req.params.name);

  var appsConfigTheme = {
    version: '0.0.0',
    description: 'Default app description',
    author: 'Unknown'
  };
  apps.insert({
    name: req.params.name,
    enabled: 1,
    timestamp: Date.now(),
    plugins: {},
    theme: 'framework7', // default?
    config: appsConfigTheme
  }, function() {
    apps.find({
      name: req.params.name
    }, function(err, docs) {
      res.render("../admin/app", {
        component: docs
      });
    });
  });
}

function getConfig(req, res, next) {


}

function setConfig(req, res) {
  var newConfig = req.body;
  apps.update({
    name: req.params.name
  }, {
    $set: {
      config: newConfig
    }
  }, function(err, docs) {
    if (err) {
      return res.type('application/json').status(500).send(err);
    }
    return res.type('application/json').status(200).send('ok');
  });
}
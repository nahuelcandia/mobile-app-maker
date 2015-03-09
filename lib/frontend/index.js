var debug = require("debug")("cms:frontend"),
  console = require("better-console"),
  hook = require("hooke"),
  extend = require("extend"),
  config = require("config"),
  join = require("path").join,
  express = require("express"),
  paths = require("config").get("paths"),
  template = require("../template"),
  ejs = require("ejs"),
  cheerio = require("cheerio");
module.exports = frontend;

hook(frontend);

/**
 * Registers URL route for viewing the app's frontend via web.
 * - Sets app.locals.config based on config loaded via the 'config' npm module.
 * - Sets app.locals.session based on res.locals.session.
 * - Handles static routes  / for the template folder inside the templates
 * - Handles static routes admin / assets
 *   for the assets folder inside the admin template
 *
 * @param {express.App} express request handler.
 */
function frontend(app) {
  frontend.setExpressDefaults(app);

  template.current(app, function(templateName) {
    debug("Current template is %s", templateName);


    app.use("/", function(req, res, next) {
      var templatePath = join(paths.templatesBase, app.get("template"));
      express.static(templatePath)(req, res, next);
    });
    app.use("/coreassets", express.static(
      join(paths.adminTemplateBase, "assets")));

  });

  frontend.hook("afterrender", function(data, locals, next) {
    data.html = injectCordovaAndPhonegap(data.html);
    next();
  });
  frontend.render = renderFrontend;
  return frontend;
}

frontend.setExpressDefaults = function(app) {
  //Make app config available to views
  app.locals.config = config;

  // Set default engine. If not, user gets this message when
  // no extension is provided  
  // No default engine was specified and no extension was provided.
  app.set("view engine", "jade");
  // Register EJS as renderer for .html files
  app.engine("html", ejs.renderFile);

  //Make jade output pretty
  if (app.get("env") === "development") {
    app.locals.pretty = true;
  }

  app.get("/", frontendMiddleware);
};


function frontendMiddleware(req, res) {
  var locals = {
    // Use this previewing local variable in the templates 
    // to show different content between the rendered HTML 
    // and the rendered app.
    previewing: true,
    // Kludge beacuse the index view does not 
    // have res.locals with the same value that
    // an res.render
    session: res.locals.session
  };
  renderFrontend(req.app, locals, function(err, html) {
    if (err) {
      return res.send(err.stack.toString());
    }
    res.send(html);
    debug("Rendered frontend to express route succesfully");
  });
}

/**
 * Renders the mobile hybrid app's frontend and passes the render HTML
 * as a parameter to a callback .
 *
 * @param {express.Application} app. For using app.render()
 * @param {Object} locals. locals that will be passed to express renderer.
 * @param {Function} cb
 *  -- {Error} err. Null if nothing bad happened
 *  -- {String} html. rendered HTML for the mobile hybrid app's frontend
 */
function renderFrontend(app, locals, cb) {

  locals = extend({}, locals);

  frontend.trigger("beforerender", locals, function(err, locals) {
    renderIndex(app, locals, function(err, html) {
      if (err) {
        console.error("Some 'beforerender' hook errored. Error was")
        console.error(err.stack.toString());
        return cb(err);
      }

      frontend.trigger("afterrender", {
        html: html
      }, locals, function(err, render, locals) {
        if (err) {
          console.error("Some 'afterrender' hook errored. Error was")
          console.error(err.stack.toString());
          return cb(err);
        }
        cb(err, render.html);
      });
    });
  });
}

function renderIndex(app, locals, cb) {
  // Try to load a JADE index file
  debug("Looking up index.jade for rendering");
  app.render("index.jade", locals, function(err, html) {
    if (err) {
      // Ugly kludge for detecting an absent index.jade on app.render error
      if ('Error: Failed to lookup view "index.jade" in views directory "templates/jqmobile"' == err) {
        debug("Current template does not have an index.jade inside. " +
          "Looking up index.html instead");
      }
      app.render("index.html", locals, function(err, html) {
        if (err) {
          debug("Frontend render error: %s", err.toString());
          console.error("You should place an index.html/index.jade file inside the template folder");
          return cb(err);
        }
        debug("Rendered frontend");
        return cb(null, html);
      });
    } else {

      debug("Rendered frontend succesfully");
      return cb(null, html);
    }

  });
}

function injectCordovaAndPhonegap(html) {

  var $ = cheerio.load(html);
  // Inject scripts referencing cordova.js and phonegap.js
  var $cordova = $("<script></script>").attr("src", "cordova.js");
  var $phonegap = $("<script></script>").attr("src", "phonegap.js");
  $("head").prepend($cordova, $phonegap);

  return $.html();
}
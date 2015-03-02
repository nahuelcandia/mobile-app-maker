var debug = require("debug")("cms:frontend"),
  console = require("better-console"),
  hook = require("hooke"),
  extend = require("extend"),
  config = require("config"),
  join = require("path").join,
  express = require("express"),
  paths = require("config").get("paths"),
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
  var templatePath = join(paths.templatesBase, app.get("template"));
  //Make app config available to views
  app.locals.config = config;
  app.get("/", frontendMiddleware);
  app.use("/", express.static(templatePath));
  app.use("/coreassets", express.static(
    join(paths.adminTemplateBase, "assets")));



  frontend.hook("afterrender", function(data, locals, next) {
    data.html = injectCordovaAndPhonegap(data.html);
    next();
  });
  frontend.render = renderFrontend;
  return frontend;
}

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
  // Try to load a JADE index file
  debug("Looking up index.jade for rendering");
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
  app.render("index.jade", locals, function(err, html) {
    if (err) {
      debug("%s", err.toString());
      debug("Looking up index.html for rendering");
      app.render("index.html", locals, function(err, html) {
        if (err) {
          debug("Frontend render error: %s", err.toString());
          console.error("You should place an index.html/index.jade file inside the template folder");
          return cb(err);
        }
        //html = replaceEditables(html, updatedEditables);
        //html = injectCordovaAndPhonegap(html);
        debug("Rendered frontend");
        return cb(null, html);
      });
    } else {
      //html = replaceEditables(html, updatedEditables);
      //html = injectCordovaAndPhonegap(html);

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
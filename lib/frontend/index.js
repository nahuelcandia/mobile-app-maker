var debug = require("debug")("cms:frontend"),
  console = require("better-console"),
  editables = require("../db").editables,
  extend = require("extend"),
  config = require("config"),
  cheerio = require("cheerio");

module.exports = frontend;
/**
 * Registers URL route for viewing the app's frontend via web.
 * - Sets app.locals.config based on config loaded via the 'config' npm module.
 * - Sets app.locals.session based on res.locals.session.
 *
 * @param {express.App} express request handler.
 */
function frontend(app) {
  //Make app config available to views
  app.locals.config = config;
  app.get("/", frontendMiddleware);
  debug("These plugins are reachable to this module: %s", JSON.stringify(app.plugins));


  function frontendMiddleware(req, res) {
    frontend.renderFrontend(app, {
      previewing: true,
      // Kludge beacuse the index view does not 
      // have res.locals with the same value that
      // an res.render
      session: res.locals.session
    }, function(err, html) {
      return res.send(html);
    });


  }

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
frontend.renderFrontend = function(app, locals, cb) {
  editables.all(function(err, updatedEditables) {
    locals = extend({}, locals);
    // Try to load a JADE index file
    debug("looking up index.jade for rendering");
    app.render("index.jade", locals, function(err, html) {
      if (err) {
        debug("Frontend render error: %s", err.toString());
        debug("looking up index.html for rendering");
        app.render("index.html", locals, function(err, html) {
          if (err) {
            debug("Frontend render error: %s", err.toString());
            console.error("You should place an index.html/index.jade file inside the template folder");
            return cb(err);
          }
          html = replaceEditables(html, updatedEditables);
          html = injectCordovaAndPhonegap(html);
          debug("Rendered frontend to express route succesfully");
          return cb(null, html);
        });
      } else {
        html = replaceEditables(html, updatedEditables);
        //html = injectCordovaAndPhonegap(html);

        debug("Rendered frontend to express route succesfully");
        return cb(null, html);
      }

    });
  });

};

function replaceEditables(html, editables) {
  var a = editables.reduce(function(obj, cur) {
    obj[cur.editableId] = cur;
    return obj;
  }, {});
  var $ = cheerio.load(html);

  // Replace all data-editable elements
  // with the last stored HTML for that element
  $("[data-editable!=''][data-editable]").each(function() {
    var editableId = $(this).attr("data-editable");
    // For all data-editables declared on the template
    // but are unmodified by the user
    if (a[editableId]) {
      $(this).html(a[editableId].html);
    }
  });
  return $.html();
}

function injectCordovaAndPhonegap(html) {

  var $ = cheerio.load(html);
  // Inject scripts referencing cordova.js and phonegap.js
  var $cordova = $("<script/>").attr("src", "cordova.js");
  var $phonegap = $("<script/>").attr("src", "phonegap.js");
  $("head").prepend($cordova, $phonegap);


  return $.html();
}
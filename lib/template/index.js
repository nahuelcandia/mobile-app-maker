var debug = require("debug")("cms:template"),
  config = require("config"),
  join = require("path").join,
  path = require("path"),
  basename = path.basename,
  walk = require('walkdir'),
  paths = config.get("paths"),
  ejs = require("ejs"),
  templatesdb = require("../db").templates;

module.exports = template;
/**
 * - Sets default express template engine to `jade`.
 * - Sets pretty output for jade if we are in development environment
 * - Sets default views path for express as an array in order to allow
 *
 * @param {express.App} express request handler
 */
function template(app, templateName) {

  template.setExpressDefaults(app);
  // Previously called templateLoader()
  findTemplates(app);

  if (typeof templateName === "undefined") {
    // Get default template from config file
    // if no one passed to this module
    var templateName = config.get("template");
    templatesdb.find({
      enabled: 1
    }, function(err, docs) {
      if (docs.length === 1) {
        templateName = docs[0].name;
        console.log(docs[0].name);
      }
    });
  }
  template.enable(app, templateName);


}

template.setExpressDefaults = function(app) {
  // Set default engine. If not, user gets this message when
  // no extension is provided  
  // No default engine was specified and no extension was provided.
  app.set("view engine", "jade");

  app.engine("html", ejs.renderFile);

  //Make jade output pretty
  if (app.get("env") === "development") {
    app.locals.pretty = true;
  }
}

template.enable = function(app, templateName) {
  template.requireTemplate(app, app.locals.templates, templateName);
  // Set template
  app.set("template", templateName);
  var templatePath = join(paths.templatesBase, app.get("template"));
  app.set("views", [templatePath]);
}

template.requireTemplate = function(app, templates, tpl) {
  try {
    debug("Trying to load index.js from '%s' template's directory as a module", tpl);
    var index = require('../../templates/' + tpl + '/index.js');
    //templates[tpl].index = index;

    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      try {
        debug("Calling template '%s' exported function (i.e. module.exports=function())", tpl);
        index(app, app.cms.server, app.cms.sockets);
      } catch (e) {
        console.warn("Error calling template '%s' index function . The error was: %s", tpl, e.toString());
        console.warn(e.stack);
      }
    } else {
      debug("The index.js inside the template directory does not export a function");
    }

  } catch (e) {
    if ("MODULE_NOT_FOUND" === e.code) {
      debug("This template has no 'index.js' inside");
    } else {
      console.warn("Couldn't load 'index.js' for template '%s'", basename(path));
      console.warn(e.stack);
    }
  }
}

/**
 * Handles the loading of templates from the templates directory.
 *
 * - This module loads the directories inside the templates directory using require.
 * - Will check if the template (module) exports a function that will be called
 *   after the module being require()d.
 * - It will only consider directories that have an index.js file inside and that
 *   index.js is the entry point for the module.
 * - If there's an error in the call to require(), the error is catched and the template
 *   is not loaded. The CMS won't crash if an error is thrown by require().
 * - Sets app.locals.templates with the list of loaded templates, thus making it
 *   available to the views. Each of the items of the locals.templates has the
 *   companion package.json for each loaded template.
 *   When the template is required, this module calls the
 * @param {express.App} app. express request handler.
 * @param {Server} server. HTTP/HTTPS server.
 * @param {Object} sockets. The sockets provided by lib/sockets.
 *   - {io.Manager} ioManager a socket.io manager instance,
 *   - {Socket} platform: client socket to platform builder services,
 *   - {Socket} adminPanel: server socket to adminPanel interface,
 *   - {Socket} frontend: server socket for web frontend
 */

function findTemplates(app, callback) {
  var templates = [];
  app.locals.templates = {};
  try {
    walk(process.cwd() + '/templates/', {
        "follow_symlinks": false, // default is off
        "no_recurse": true, // only recurse one level deep
        "max_depth": undefined // only recurse down to max_depth. if you need more than no_recurse
      },
      function(path, stat) {
        if (stat.isDirectory()) {

          debug("Found template '%s'", basename(path));
          if (path.lastIndexOf('admin') < 0) {
            var defaults = {};
            var tpl = path.split('/')[path.split('/').length - 1];
            templates[tpl] = {
              metadata: {}
            };
            try {
              defaults = require('../../templates/' + tpl + '/defaults.json');
            } catch (e) {
              //debug("Template defaults.json not found");
            }
            app.locals.templates = templates;
            saveTemplate(tpl, defaults, templates[tpl].metadata);
          }
        }
      });
  } catch (e) {
    console.error("template-loader errored: %s", e.stack);
    debug("template-loader errored: %j", e);
    return;
  }
  return true;
}
/**
 * Saves the state of a template to the DB.
 *
 * @param {String} k. The id/name of a template (usually the directory name of the template)
 */
function saveTemplate(k, config, metadata) {

  templatesdb.find({
    name: k
  }, function(err, docs) {
    var key = k;
    if (docs.length < 1) {
      templatesdb.insert({
        name: key,
        enabled: 0,
        timestamp: Date.now(),
        config: config,
        metadata: metadata
      }, function(err) {
        if (err) {
          debug("I errored loading template into db: " + key);
        } else {
          debug("I loaded template into db: " + key);
        }
      });
    }
  });
}
var debug = require("debug")("cms:plugin-loader"),
  config = require("config"),
  console = require("better-console"),
  loader = require("require-directory"),
  fs = require('fs'),
  join = require("path").join,
  dirname = require("path").dirname,
  db = require("../../lib/db"),
  pluginsdb = require("../db").plugins;

module.exports = componentsLoader;

function componentsLoader(app, server, sockets) {
  pluginLoader(app, server, sockets);
}

/**
 * Handles the loading of plugins from the plugins directory.
 *
 * - This module loads the directories inside the plugins directory using require.
 * - Will check if the plugin (module) exports a function that will be called
 *   after the module being require()d.
 * - It will only consider directories that have an index.js file inside and that
 *   index.js is the entry point for the module.
 * - If there's an error in the call to require(), the error is catched and the plugin
 *   is not loaded. The CMS won't crash if an error is thrown by require().
 * - Sets app.locals.plugins with the list of loaded plugins, thus making it
 *   available to the views. Each of the items of the locals.plugins has the
 *   companion package.json for each loaded plugin.
 *   When the plugin is required, this module calls the
 * @param {express.App} app. express request handler.
 * @param {Server} server. HTTP/HTTPS server.
 * @param {Object} sockets. The sockets provided by lib/sockets.
 *   - {io.Manager} ioManager a socket.io manager instance,
 *   - {Socket} platform: client socket to platform builder services,
 *   - {Socket} adminPanel: server socket to adminPanel interface,
 *   - {Socket} frontend: server socket for web frontend
 */

function pluginLoader(app, server, sockets) {
  var plugins;
  try {
    plugins = loader(module, "../../plugins", {
      exclude: /node_modules/,
      include: /index.js$/
    });

  } catch (e) {
    console.error("plugin-loader errored: %s", e.stack);
    debug("plugin-loader errored: %j", e);
    return;
  }
  app.plugins = plugins;
  // Make the plugins list available to the view
  app.locals.plugins = plugins;
  app.locals.pluginsArray = [];
  // Run module.exports if is a function
  // require-directory give it the name index
  for (var k in plugins) {
    //debug("Loaded module %s", k);


    var index = plugins[k].index;
    var pkg = {};
    var defaults = {};
    try {
      pkg = require('../../plugins/' + k + '/package.json');
    } catch (e) {
      //debug("Plugins package.json not found");
    }
    plugins[k].metadata = pkg;

    try {
      defaults = require('../../plugins/' + k + '/defaults.json');
    } catch (e) {
      //debug("Plugins defaults.json not found");
    }
    app.locals.pluginsArray.push({
      id: k,
      value: k,
      metadata: pkg,
    });
    // load into filestorage if not already
    savePlugin(k, defaults);

    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      //debug("Calling plugin %s index function (i.e. module.exports=function())", k);
      try {
        plugins[k].index(app, server, sockets);
      } catch (e) {
        debug("Plugin index function errored");
        console.warn("Error trying to load plugin '%s'. The error was: %s", k, e.toString());
        debug(e);
      }
    }
  }
  //addPluginViews(app);
  return plugins;
}
/**
 * Saves the state of a plugin to the DB.
 *
 * @param {String} k. The id/name of a plugin (usually the directory name of the plugin)
 */
function savePlugin(k, config) {
  pluginsdb.find({
    name: k
  }, function(err, docs) {
    var key = k;
    if (docs.length < 1) {
      pluginsdb.insert({
        name: key,
        enabled: 0,
        timestamp: Date.now(),
        config: config
      }, function(err) {
        if (err) {
          debug("I errored loading plugin into db: " + key);
        } else {
          debug("I loaded plugin into db: " + key);
        }
      });
    }
  });
}



function addPluginViews(app) {
  var pluginsBaseDir = join(process.cwd(), "plugins");
  debug("Searching for views in plugins directories");
  var pluginNames = Object.keys(app.plugins),
    pluginsViewPaths = pluginNames.filter(function(pluginName) {
      var dir = join(pluginsBaseDir, pluginName, "views", pluginName);
      if (fs.existsSync(dir)) {
        debug("Views found in plugin directory %s", dir);
        return true;
      } else {
        debug("No views directory found in %s", dir);
        return false;
      }
    }).map(function(pluginName) {
      return join(pluginsBaseDir, pluginName, "views");
    });
  // Set views path
  var viewPaths = app.get("views").concat(pluginsViewPaths);
  debug("Views are being loaded from: \n - %s", viewPaths.join("\n - "));
  app.set("views", viewPaths);

}

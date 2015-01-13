var debug = require("debug")("cms:plugin-loader"),
  console = require("better-console"),
  loader = require("require-directory"),
  join = require("path").join,
  db = require("../db"),
  pluginsdb = require("../db").plugins;

module.exports = pluginLoader;


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

  // Run module.exports if is a function
  // require-directory give it the name index
  for (var k in plugins) {
    debug("Loaded module %s", k);
    var index = plugins[k].index;
    var pkg = {};
    try {
      pkg = require('../../plugins/' + k + '/package.json');
    } catch (e) {
      debug("Plugins package.json not found");
    }
    plugins[k].metadata = pkg;

    // load into filestorage if not already
    savePlugin(k);

    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      debug("Calling plugin %s index function (i.e. module.exports=function())", k);
      try {
        plugins[k].index(app, server, sockets);

      } catch (e) {
        debug("Plugin index function errored");
        console.warn("Error trying to load plugin '%s'. The error was: %s", k, e.toString());
        debug(e);
      }
    }
  }
  return plugins;
}

function savePlugin(k) {
  pluginsdb.find({
    name: k
  }, function(err, docs) {
    var key = k;
    debug(k);
    debug(docs.length)
    if (docs.length < 1) {
      pluginsdb.insert({
        name: key,
        enabled: 0,
        timestamp: Date.now()
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
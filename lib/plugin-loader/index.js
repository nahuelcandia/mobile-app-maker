var debug = require("debug")("cms:plugin-loader"),
  loader = require("require-directory"),
  join = require("path").join;

module.exports = pluginLoader;


function pluginLoader(app) {
  var plugins;
  try {
    plugins = loader(module, "../../plugins", {
      include: /index.js$/
    });

  } catch (e) {
    debug("plugin-loader errored");
    debug(e);
    return;
  }
  app.plugins = plugins;
  // Make the plugins list available to the view
  app.locals.plugins = plugins

  // Run module.exports if is a function
  // require-directory give it the name index
  for (var k in plugins) {
    debug("Loaded module %s", k);
    var index = plugins[k].index;
    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      debug("Calling plugin %s index function (i.e. module.exports=function())", k);
      try {
        plugins[k].index(app);

      } catch (e) {
        debug("Plugin index function errored");
        debug(e);
      }
    }
  }
  return plugins;
}
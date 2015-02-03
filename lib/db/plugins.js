var debug = require("debug")("cms:db:plugins");

module.exports = pluginsModule;

function pluginsModule(plugins) {
  debug("Creating plugins db object");
  plugins.all = function(callback) {
    plugins.find({}).sort({
      pluginId: 1
    }).exec(callback);
  };

  return plugins;

}
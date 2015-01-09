var debug = require("debug")("cms:db:plugins");

module.exports = pluginsModule;

function pluginsModule(plugins) {

  plugins.saveEdition = function(updatedPlugin, callback) {

    debug("Trying to save plugin");
    plugins.update({
        pluginId: updatedPlugin.id
      }, {
        pluginId: updatedPlugin.id,
        enabled: updatedPlugin.enabled,
        modified: Date.now()
      }, {
        upsert: true
      },
      callback);

  }

  plugins.all = function(callback) {
    plugins.find({}).sort({
      pluginId: 1
    }).exec(callback);
  }

  return plugins;

}
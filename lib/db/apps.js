var debug = require("debug")("cms:db:apps");

module.exports = appsModule;

function appsModule(apps) {
  debug("Creating apps db object");
  apps.all = function(callback) {
    apps.find({}).exec(callback);
  };

  return apps;

}
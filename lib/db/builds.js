var debug = require("debug")("cms:db:builds");

module.exports = build;

function build(builds) {

  builds.saveBuild = function(buildToSave, callback) {

    debug("Trying to save build");
    builds.update({
        buildId: buildToSave.id
      }, {
        buildId: buildToSave.id,
        timestamp: Date.now()
      }, {
        upsert: true
      },
      callback);

  };

  builds.all = function(callback) {
    builds.find({}).sort({
      buildId: 1
    }).exec(callback);
  };

  return builds;

}
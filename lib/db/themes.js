var debug = require("debug")("cms:db:themes");

module.exports = themesModule;

function themesModule(themes) {
  debug("Creating theme db object");
  themes.all = function(callback) {
    themes.find({}).sort({
      themeId: 1
    }).exec(callback);
  };

  return themes;

}
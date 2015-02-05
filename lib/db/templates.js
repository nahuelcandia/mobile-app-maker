var debug = require("debug")("cms:db:templates");

module.exports = templatesModule;

function templatesModule(templates) {
  debug("Creating template db object");
  templates.all = function(callback) {
    templates.find({}).sort({
      templateId: 1
    }).exec(callback);
  };

  return templates;

}
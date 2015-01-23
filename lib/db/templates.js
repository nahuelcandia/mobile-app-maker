var debug = require("debug")("cms:db:templates");

module.exports = pluginsModule;

function pluginsModule(templates) {

  templates.all = function(callback) {
    templates.find({}).sort({
      templateId: 1
    }).exec(callback);
  }

  return templates;

}
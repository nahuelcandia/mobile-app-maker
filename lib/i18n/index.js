var i18n = require("i18n");
var debug = require("debug")("cms:i18n");

module.exports = internationalize

function internationalize(app) {

  i18n.configure({
    locales: ['en', 'es', 'fr', 'de', 'ja', 'pt'],
    directory: __dirname + '/locales',
    debug: true,
    indent: "  "
  });

  app.use(i18n.init);
  app.locals.__ = i18n.__;

}
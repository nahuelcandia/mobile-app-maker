var i18n = require("i18n");
var debug = require("debug")("cms:i18n");

module.exports = internationalize;
/**
 * Configures internationalization for express' renderer.
 * - Makes the function __() available to the template
 * - Makes the function __n() available to the template
 *
 * @param {express.App} express request handler.
 */
function internationalize(app) {

  i18n.configure({
    locales: ['en', 'es', 'fr', 'de', 'ja', 'pt'],
    directory: './config/locales',
    debug: true,
    indent: "  "
  });

  app.use(i18n.init);
  app.locals.__ = i18n.__;
  app.locals.__n = i18n.__n;
  debug("Internationalization initialized. Current lang: " + i18n.getLocale());
}
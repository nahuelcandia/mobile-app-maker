var i18n = require("i18n"),
  debug = require("debug")("cms:i18n"),
  config = require("config").get("localization");

module.exports = internationalize;
/**
 * Configures internationalization for express' renderer.
 * - Makes the function __() available to the views
 * - Makes the function __n() available to the views
 *
 * @param {express.App} express request handler.
 */
function internationalize(app) {

  i18n.configure({
    locales: config.locales,
    directory: config.directory,
    debug: true,
    indent: "  "
  });

  app.use(i18n.init);
  app.locals.__ = i18n.__;
  app.locals.__n = i18n.__n;
  debug("Internationalization initialized. Current lang: " + i18n.getLocale());

  app.use('*', function(req, res, next) {
    var catalogs = i18n.getCatalog();

    app.locals.lang = catalogs[req.locale];
    next();
  });
}
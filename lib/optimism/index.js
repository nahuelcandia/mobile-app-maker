var debug = require("debug")("cms:optimism"),
  backendConfig = require("config").get("backend"),
  s = require("sprintf"),
  myelements = require("myelements.jquery");
cheerio = require("cheerio");

module.exports = optimism;

function optimism(app, server, sockets) {
  app.cms.frontend.hook("render", function(data, locals, next) {
    data.html = injectMyelements(data.html);
    next();
  });
  app.cms.packager.hook("package", function(bulks, files, next) {
    files.push({
      content: myelements.client(),
      name: "myelements/myelements.jquery.js"
    });
    next();
  });
}
/*
 *
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 * INJECT MYELEMENTS.JQUERY.JS IN THE APP FOLDER. ADD PACKAGE.ADDDIR
 */
function injectMyelements(html) {
  var $ = cheerio.load(html),
    // Inject scripts referencing cordova.js and phonegap.js
    myelementsUrl = "myelements/myelements.jquery.js",
    $myelementsScript = $("\n<script></script>\n").attr("src", myelementsUrl),
    $script = $("\n<script></script>\n"),
    code = s("\n%s\n%s\n",
      'window.myElementsOptions = {\
      socketHost: "' + backendConfig.baseUrl + '", \
      socketPath: "/myelements.io" \
      }', "var b = 3;");
  $script.text(code);
  $("head").append($script, $myelementsScript);

  return $.html();
}
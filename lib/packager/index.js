var archiver = require("archiver");
var debug = require("debug")("cms:packager");
var path = require("path");
var frontend = require("../frontend"),
  config = require("config");
module.exports = packager;

var config = {
  // Base path used in the ZIP file structure
  htmlBasePath: "www",
  // Specific config for the template logic
  template: config.get("template")
};
/**
 * Registers URL route for downloading the mobile hybrid app as a ZIP file.
 *
 * @param {express.App} express request handler.
 */
function packager(app) {
  app.get("/package/download", function(req, res) {
    packager.download(app, res);
  });
}
/**
 * Handles the download of the mobile hybrid app as a Zip File
 * It uses node streams for piping to the client.
 *
 * @param {express.App} express request handler.
 * @param {express.Response} express Response object.
 */
packager.download = function(app, res) {

  frontend.renderFrontend(app, {}, function(err, html) {
    if (err) {
      debug("rendering failed on downloadPackage %s", err.stack);
      res.status(500).send("<pre>" + err.toString() + "</pre>");
      return;
    }
    var zipStream = packager.createAppZipStream(html);
    res.attachment("shovelapps-cms-app.zip");
    zipStream.on("error", function(err) {
      debug("Error creating app zip stream");
      debug(err);
    });
    zipStream.pipe(res);
    //zipStream.pipe(output);
    zipStream.on("finish", function() {
      res.end();
    });


  });
};

/**
 * Creates a node stream of a ZIP file created in memory
 * The 'archiver' module is used here in order for adding
 * several files from the assets folder, the template and the rendered frontend
 *
 * @param {String} frontendHTML. The mobile hybrid app's frontend rendered by
 *   the frontend module
 * @event 'finish'. on piping complete.
 * @event 'error'. on error related to the stream or the piping action.
 */
packager.createAppZipStream = function(frontendHtml) {
  var zipArchive = archiver("zip");

  zipArchive.bulk([{
    expand: true,
    cwd: path.join(process.cwd(), "templates", config.template),
    // This globbing pattern exclude the index.* files.
    // the index.jade/index.html are render and some code is injected
    // prioring to packaging. 
    // The index.js, the entry point for backend code should not be included in 
    // in the zip file
    src: ['**/!(index.*)'],
    dest: config.htmlBasePath
  }, {
    expand: true,
    cwd: path.join(process.cwd(), "phonegapandcordova"),
    src: ['**/*.js'],
    dest: config.htmlBasePath + '/'
  }, {
    expand: true,
    cwd: path.join(process.cwd(), "templates", config.template, "assets"),
    src: ['**'],
    dest: config.htmlBasePath + '/assets'
  }, {
    expand: true,
    cwd: 'lib/client',
    src: ['**'],
    dest: config.htmlBasePath + '/shovelapps'
  }]);
  zipArchive.append(frontendHtml, {
    name: config.htmlBasePath + '/index.html'
  });
  zipArchive.finalize();

  return zipArchive;
};
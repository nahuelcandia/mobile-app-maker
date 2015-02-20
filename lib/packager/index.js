var archiver = require("archiver"),
  debug = require("debug")("cms:packager"),
  join = require("path").join,
  config = require("config"),
  packagerconfig = config.get("packager"),
  paths = config.get("paths");

module.exports = packager;

var config = {
  // Base path used in the ZIP file structure
  htmlBasePath: config.get("packager").htmlBasePath,
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
  debug(app.cms.frontend);
  app.cms.frontend.trigger("render", {}, {}, function(err, data, locals) {
    debug("chota");
    console.log(arguments);
    if (err) {
      debug("rendering failed on downloadPackage %s", err.stack);
      res.status(500).send("<pre>" + err.toString() + "</pre>");
      return;
    }
    var zipStream = packager.createAppZipStream(data.html);
    res.attachment(packagerconfig.zipFilename);
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
 * The "archiver" module is used here in order for adding
 * several files from the template folder and the rendered frontend
 *
 * @param {String} frontendHTML. The mobile hybrid app"s frontend rendered by
 *   the frontend module
 * @event "finish". on piping complete.
 * @event "error". on error related to the stream or the piping action.
 */
packager.createAppZipStream = function(frontendHtml) {
  var zipArchive = archiver("zip"),
    templatePath = join(paths.templatesBase, config.template);

  zipArchive.bulk([{
    expand: true,
    cwd: join(templatePath),
    // This globbing pattern exclude the index.* files.
    // the index.jade/index.html are render and some code is injected
    // prior to packaging. 
    // The index.js, the entry point for backend code should not be included in 
    // in the zip file
    src: ["**/!(index.*)"],
    dest: config.htmlBasePath
  }, {
    expand: true,
    cwd: join(process.cwd(), "phonegapandcordova"),
    src: ["**/*.js"],
    dest: config.htmlBasePath + "/"
  }, {
    expand: true,
    cwd: "lib/admin/client",
    src: ["**"],
    dest: config.htmlBasePath + "/shovelapps"
  }]);
  zipArchive.append(frontendHtml, {
    name: config.htmlBasePath + "/index.html"
  });
  zipArchive.finalize();

  return zipArchive;
};
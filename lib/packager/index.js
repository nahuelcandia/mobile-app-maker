var archiver = require("archiver");
var debug = require("debug")("cms:packager");
var path = require("path");
var frontend = require("../frontend"),
  config = require("config");
module.exports = packager;

var config = {
  htmlBasePath: "",
  template: config.get("template")
};

function packager(app) {
  app.get("/package/download", function(req, res) {
    packager.download(app, res);
  });
}

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
 * Emits
 *   - finish on piping complete.
 */
packager.createAppZipStream = function(frontendHtml) {
  var zipArchive = archiver("zip");

  zipArchive.append(frontendHtml, {
    name: config.htmlBasePath + '/index.html'
  });
  zipArchive.bulk([{
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

  zipArchive.finalize();

  return zipArchive;
};
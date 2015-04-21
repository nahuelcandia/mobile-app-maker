/* #License 
 *
 * The MIT License (MIT)
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 *
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

var archiver = require("archiver"),
  console = require("better-console"),
  debug = require("debug")("cms:packager"),
  hook = require("hooke"),
  join = require("path").join,
  config = require("config"),
  packagerconfig = config.get("packager"),
  paths = config.get("paths");

module.exports = packager;

hook(packager);

var config = {
  // Base path used in the ZIP file structure
  htmlBasePath: config.get("packager").htmlBasePath,

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
  return packager;
}
/**
 * Handles the download of the mobile hybrid app as a Zip File
 * It uses node streams for piping to the client.
 *
 * @param {express.App} express request handler.
 * @param {express.Response} express Response object.
 */
packager.download = function(app, res) {

  app.cms.frontend.render(app, {}, function(err, html) {

    if (err) {
      debug("rendering failed on downloadPackage %s", err.stack);
      res.status(500).send("<pre>" + err.toString() + "</pre>");
      return;
    }
    var zipStream = packager.createAppZipStream(app, html);
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
 * several files from the theme folder and the rendered frontend
 *
 * @param {String} frontendHtml. The mobile hybrid app"s frontend rendered by
 *   the frontend module
 * @event "finish". on piping complete.
 * @event "error". on error related to the stream or the piping action.
 */
packager.createAppZipStream = function(app, frontendHtml) {
  var zipArchive = archiver("zip"),
    themePath = join(paths.themesBase, app.get("theme"));
  var bulks = [{
    expand: true,
    cwd: join(themePath),
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
  }];
  var files = [{
    content: frontendHtml,
    name: "index.html"
  }];
  packager.hook("package", function(bulks, files, next) {

    next();
  });
  packager.trigger("package", bulks, files, function(err, bulks, files) {
    if (err) {
      console.error("Error at some packager.package hook");
      console.error(err.stack);
      return zipArchive;
    }
    zipArchive.bulk(bulks);
    files.forEach(function(file) {
      zipArchive.append(file.content, {
        name: join(config.htmlBasePath, file.name)
      });
    });
    zipArchive.finalize();
  })


  return zipArchive;
};
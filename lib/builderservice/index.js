var io = require('socket.io');
var ioclient = require('socket.io-client');
var ss = require('socket.io-stream');
var fs = require("fs");
var path = require("path");
var packager = require("../packager");
var frontend = require("../frontend");

var debug = require("debug")("cms:builderservice");

module.exports = builder;

config = {
  appName: "My first app",
  shovelappsPlatformUrl: "http://platform.shovelapps.com"
};
// Socket connection to Shovel apps Platform 
var platform;

function builder(app, httpServer) {
  // We receive connections as server from the CMS
  var sockets = io(httpServer);
  sockets.on("connection", function(socket) {
    socket.on("buildApk", function(options) {
      builder.renderAndRequestBuild(app, socket);
    });

    app.on("source code upload progress", function() {
      socket.emit("source code upload progress");
    });

    app.on("apkbuilt", function(data) {
      debug('apkbuilt');
      debug(arguments);
      socket.emit("apkbuilt", data);
    });
    app.on("upload-complete", function() {
      socket.emit("upload-complete");
    });

    // Tell the CMS frontend that we are connected
    // to the build platform by emitting.
    // If we are already connected on init
    if (!platform.disconnected) {
      socket.emit("platform connect");
    }
    // Or if the connection takes place later
    platform.on("connect", function platformSocketError(err) {
      socket.emit("platform connect");
    });
  });
  // We connect as client to the Shovel apps platform
  platform = ioclient.connect(config.shovelappsPlatformUrl + "/zipbundle");
  debug("Connecting socket to %s", config.shovelappsPlatformUrl);

  platform.on("connect", function platformSocketError(err) {
    debug("Socket connected to %s", config.shovelappsPlatformUrl);
  });

  platform.on("error", function platformSocketError(err) {
    debug("Error on platform socket %s", err.toString());
  });

}

builder.renderAndRequestBuild = function(app, clientSocket) {
  frontend.renderFrontend(app, {}, function(err, html) {
    if (err) {
      clientSocket.emit("error rendering frontend");
      debug("rendering failed on builder %s", err.stack);
      return;
    }

    var zipStream = packager.createAppZipStream(html);
    //temporary file for getting the stream size
    var filename = path.join(process.cwd(), "filestorage", "tmp", "app.zip");
    var fs = require("fs");
    var tmpFileStream = fs.createWriteStream(filename);

    zipStream.on("error", function(err) {
      debug("Error creating app zip stream");
      debug(err);
    });
    // From archiver docs.
    //   The end, close or finish events on the destination stream 
    //    may fire right after calling this method so you should 
    //   set listeners beforehand to properly detect stream completion. 
    // BUT!!! The finish event on archive is unreliable. it fires when
    // finalize() is called.
    zipStream.on("end", function() {
      debug(fs.statSync(filename).size);
      tmpFileStream.end(undefined, undefined, function() {
        zipStream.unpipe(tmpFileStream);
        debug("finished zipping");
        clientSocket.emit("finished zipping");
        var readStream = fs.createReadStream(filename, {
          autoClose: true
        });
        var buildStream = builder.createBuildRequestStream(app, {
          appName: config.appName,
          size: fs.statSync(filename).size
        });
        debug(fs.statSync(filename).size);

        buildStream.on("error", function(err) {
          debug("Error building app.");
          debug(err);
        });

        readStream.pipe(buildStream);
      });
    });

    zipStream.pipe(tmpFileStream);

  });
}

builder.createBuildRequestStream = function(app, appOptions) {

  var stream = ss.createStream();

  platform.on('apkbuilt', function(data) {
    debug('Platform emitted apkbuilt');
    debug(arguments);
    app.emit('apkbuilt', data);
  });
  platform.on('datareceived', function(data) {
    debug("Platform emitted datareceived");
    debug(data);
    app.emit('source code upload progress', data);
    if (data.progress == "100%") {
      debug('source code upload complete');
      app.emit('upload-complete', data);
    }
  });
  ss(platform).emit('sourcecodeupload', stream, appOptions);
  return stream;

}
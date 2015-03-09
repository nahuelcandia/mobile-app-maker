var ss = require("socket.io-stream"),
  path = require("path"),
  jade = require("jade"),
  packager = require("../../lib/packager"),
  frontend = require("../../lib/frontend"),
  config = require("config").get("app"),
  debug = require("debug")("cms:builderservice"),
  builds = require("../../lib/db").builds;
module.exports = builder;


function builder(app, server, sockets) {
  var status = "";

  app.get("/admin/build", function(req, res) {
    debug("Finding previous builds");
    builds.find({}).limit(9).exec(function(err, docs) {
      if (err) {
        return res.send(500, "I errored");
      }
      docs.forEach(function(doc) {
        var d = new Date(doc.timestamp);
        doc.date = d.toDateString();
        doc.buildIdShort = doc.buildId.split("-")[0];

      });
      debug("Found %s previous builds", docs.length);
      app.locals.builds = docs;
      res.send(jade.renderFile(__dirname + "/build.jade", app.locals));
    });
  });

  builder.sockets = sockets;

  sockets.platform.on("apkbuilt", function(data) {
    debug("Platform emitted apkbuilt with data: %j", data);
    app.emit("apkbuilt", data);
  });

  sockets.platform.on("apkbuilderror", function(data) {
    debug("Platform emitted apkbuilderror with data: %j", data);
    app.emit("apkbuilderror", data);
  });

  sockets.platform.on("datareceived", function(data) {
    debug("Uploading %s to Shovel apps Platform. Progress: %s",
      data.buildId.buildId, data.progress);
    app.emit("source code upload progress", data);
    if (data.progress === "100%") {
      debug("Source code upload complete");
      app.emit("upload-complete", data);
    }
  });

  app.on("apkbuilt", function(data) {
    debug("CMS emitted apkbuilt with data: %j", data);
    var buildData = data.url.split("/");
    var buildId = buildData[buildData.length - 1].split(".")[0];
    builds.update({
      buildId: buildId
    }, {
      $set: {
        buildId: buildId,
        apkUrl: data.url,
        built: 1,
        timestamp: Date.now()
      }
    });
  });

  app.on("apkbuilderror", function(data) {
    debug("CMS emitted apkbuilderror with data: %j", data);
    var buildData = data.url.split("/");
    var buildId = buildData[buildData.length - 1].split(".")[0];
    builds.update({
      buildId: buildId
    }, {
      $set: {
        buildId: buildId,
        apkUrl: data.url,
        built: 0,
        error: 1,
        timestamp: Date.now()
      }
    });
  });

  app.on("upload-complete", function(data) {
    builds.insert({
      buildId: data.buildId.buildId,
      apkUrl: "",
      built: 0,
      timestamp: Date.now()
    });
  });
  sockets.adminPanel.on("connection", function(adminpanelSocket) {
    adminpanelSocket.on("already working?", function() {
      if (status === "") {
        adminpanelSocket.emit("doin nothing");
      } else if (status !== "source code upload progress") {
        adminpanelSocket.emit(status);
      }
      debug("Checking builder status: " + status);
    });
    adminpanelSocket.on("buildApk", function(options) {
      debug("APK build request from Admin panel with options: %j", options);
      builder.renderAndRequestBuild(app, adminpanelSocket);
      status = 1;
    });
    app.on("source code upload progress", function(data) {
      debug("Emitting 'source code upload progress' to Admin panel client");
      adminpanelSocket.emit("source code upload progress", data);
      status = "source code upload progress";
    });
    app.on("apkbuilt", function(data) {
      adminpanelSocket.emit("apkbuilt", data);
      status = "";
    });
    app.on("upload-complete", function(data) {
      debug("Uploading %s to Shovel apps platform completed.",
        data.buildId.buildId);
      adminpanelSocket.emit("upload-complete", data);
      status = "upload-complete";
    });
    // Tell the CMS frontend that we are connected
    // to the build platform by emitting.
    // If we are already connected on init
    if (!sockets.platform.disconnected) {
      adminpanelSocket.emit("platform connect");
    }
    // Or if the connection takes place later
    sockets.platform.on("connect", function platformSocketError() {
      adminpanelSocket.emit("platform connect");
    });
  });
}

builder.renderAndRequestBuild = function(app, clientSocket) {
  app.cms.frontend.render(app, {}, function(err, html) {
    if (err) {
      clientSocket.emit("error rendering frontend");
      debug("Rendering failed on builder %s", err.stack);
      return;
    }
    var zipStream = packager.createAppZipStream(app, html);
    //temporary file for getting the stream size
    var filename = path.join(process.cwd(), "filestorage", "tmp", "app.zip");
    var fs = require("fs");
    var tmpFileStream = fs.createWriteStream(filename);
    zipStream.on("error", function(err) {
      debug("Error creating app zip stream: %s", err);
    });
    // From archiver docs.
    //   The end, close or finish events on the destination stream 
    //    may fire right after calling this method so you should 
    //   set listeners beforehand to properly detect stream completion. 
    // BUT!!! The finish event on archive is unreliable. it fires when
    // finalize() is called.
    zipStream.once("end", function() {
      tmpFileStream.end(undefined, undefined, function() {
        zipStream.unpipe(tmpFileStream);
        debug("Finished zipping");
        clientSocket.emit("finished zipping");
        var readStream = fs.createReadStream(filename, {
          autoClose: true
        });
        var buildStream = builder.createBuildRequestStream(app, {
          appName: config.appName,
          size: fs.statSync(filename).size
        });
        buildStream.on("error", function(err) {
          debug("Error building app: %j", err);
        });
        debug("Started piping zip file to platorm");
        readStream.pipe(buildStream);
      });
    });
    zipStream.pipe(tmpFileStream);
  });
};

builder.createBuildRequestStream = function(app, appOptions) {
  var sockets = builder.sockets,
    stream = ss.createStream();
  ss(sockets.platform).emit("sourcecodeupload", stream, appOptions);
  return stream;
};
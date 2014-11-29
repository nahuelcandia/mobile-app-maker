var debug = require("debug")("cms:sockets");
var console = require("better-console");
var io = require('socket.io');
var ioclient = require('socket.io-client');

var config = {
  shovelappsPlatformUrl: "http://platform.shovelapps.com"
}


// Socket connection to Shovel apps Platform 

module.exports = initSockets;


function initSockets(app, server, options) {
  var platform,
    // Socket connection to Shovel apps CMS backend admin panel 
    adminPanel,
    // Socket connection to apps frontend, in development and in production 
    frontend;
  // We connect as client to the Shovel apps platform
  platform = ioclient.connect(config.shovelappsPlatformUrl + "/zipbundle");
  // platform.transport.on("error", function(e) {
  //   console.error("Error connecting to Shovel apps Platfrom")
  // });
  debug("Connecting socket to %s", config.shovelappsPlatformUrl);

  platform.on("connect", function platformSocketConnect(err) {
    debug("Socket connected to %s", config.shovelappsPlatformUrl);
  });

  platform.on("error", function platformSocketError(err) {
    debug("Error on platform socket %s", err.toString());
  });
  // We receive connections as server from the CMS's admin panel
  var ioManager = io(server);
  adminPanel = ioManager.of("/admin");
  adminPanel.on("connection", function adminPanelConnect(socket) {
    debug("Client on admin panel connected.");
  });
  // We receive connections as server from the CMS's frontend and the production app
  frontend = ioManager.of("/");

  return {
    io: ioManager,
    platform: platform,
    adminPanel: adminPanel,
    frontend: frontend
  };
}
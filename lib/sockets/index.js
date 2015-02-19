var debug = require("debug")("cms:sockets"),
  io = require('socket.io'),
  config = require("config").get("platform"),
  ioclient = require('socket.io-client');




// Socket connection to Shovel apps Platform 

module.exports = initSockets;

/**
 * Creates sockets for communications with the frontend,
 * the admin interface and Shovel apps platform.
 * The sockets are made available to any plugin or
 * module inside lib/*
 *
 * @param {express.App} express request handler
 * @param {Server} http/https server
 * @returns {Object}
 *   - {io.Manager} ioManager a socket.io manager instance,
 *   - {Socket} platform: client socket to platform builder services,
 *   - {Socket} adminPanel: server socket to adminPanel interface,
 *   - {Socket} frontend: server socket for web frontend
 */
function initSockets(app, server) {
  var platform,
    // Socket connection to Shovel apps CMS backend admin panel 
    adminPanel,
    // Socket connection to apps frontend, in development and in production 
    frontend;
  // We connect as client to the Shovel apps platform
  platform = ioclient.connect(config.shovelappsPlatformUrl + "/zipbundle");

  debug("Connecting socket to %s", config.shovelappsPlatformUrl);

  platform.on("connect", function platformSocketConnect(err) {
    if (err) {
      debug("Error connecting to %s: %s", config.shovelappsPlatformUrl, err);
    }
    debug("Socket connected to %s", config.shovelappsPlatformUrl);
  });

  platform.on("error", function platformSocketError(err) {
    debug("Error on platform socket %s", err.toString());
  });
  // We receive connections as server from the CMS's admin panel
  var ioManager = io(server);
  adminPanel = ioManager.of("/admin");
  adminPanel.on("connection", function adminPanelConnect(socket) {
    debug("Client on admin panel connected. Socket id: %s", socket.id);
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
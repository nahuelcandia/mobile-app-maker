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

var debug = require("debug")("cms:sockets"),
  io = require("socket.io"),
  config = require("config").get("platform"),
  ioclient = require("socket.io-client");




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
  // We receive connections as server from the CMS"s admin panel
  var ioManager = io(server);
  adminPanel = ioManager.of("/admin");
  adminPanel.on("connection", function adminPanelConnect(socket) {
    debug("Client on admin panel connected. Socket id: %s", socket.id);
  });
  // We receive connections as server from the CMS"s frontend 
  // and the production app
  frontend = ioManager.of("/");

  return {
    io: ioManager,
    platform: platform,
    adminPanel: adminPanel,
    frontend: frontend
  };
}
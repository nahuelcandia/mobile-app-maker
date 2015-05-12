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

var debug = require("debug")("cms:setup"),
  sprintf = require("sprintf"),
  config = require("config"),
  bodyParser = require("body-parser"),
  os = require('os');

module.exports = setup;

function setup(app) {
  setBodyParsers(app);
  setBackendBaseUrl(app);
}

function setBodyParsers(app) {
  app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
  }));

  app.use(bodyParser.json());
}

function setBackendBaseUrl(app) {
  var backendConfig = require("config").get("backend"),
    addresses = localIpAddresses(),
    baseUrl = "";

  // if backend base Url is defined in config, let it override
  // autodetection.
  if (backendConfig.baseUrl) {
    debug("Setting backend baseUrl to the one found in config file");
    baseUrl = backendConfig.baseUrl;
  } else {
    debug("Setting backend baseUrl to the first IP address found in the host");
    baseUrl = sprintf("http://%s:3000", addresses[0]);
  }
  app.set("backend.baseUrl", baseUrl);
  debug("Setting backend.baseUrl to: %s", baseUrl);
  debug(app.get("config"));
};

function localIpAddresses() {
  'use strict';

  var ifaces = os.networkInterfaces(),
    addresses = [];

  Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      addresses.push(iface.address);

    });
  });
  return addresses;

}
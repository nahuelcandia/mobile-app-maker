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
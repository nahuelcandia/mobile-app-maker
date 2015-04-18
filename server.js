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

//var debug = require("debug")("cms");
//var config = require("config");
var http = require("http");
var app = require("express")();
var myelements = require("myelements.jquery");

// Regular HTTP Server
var server = http.createServer(app);

myelements(app, server, {
  socketPath: "/myelements.io"
});
//Using HTTPS server
// http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server
// Generate keys like this
// $ openssl genrsa -out key.pem
// $ openssl req -new -key key.pem -out csr.pem
// $ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
// $ rm csr.pem

//var https = require("https");
//var fs = require("fs");
// var server = https.createServer({
//   key: fs.readFileSync('.sslcerts/key.pem'),
//   cert: fs.readFileSync('.sslcerts/cert.pem')
// }, app);

app.cms = {};
app.cms.server = server;
require("./lib/setup")(app);
app.cms.i18n = require("./lib/i18n")(app);
app.cms.session = require("./lib/session")(app);
app.cms.sockets = require("./lib/sockets")(app, server);
app.cms.installer = require("./lib/installer")(app);
app.cms.theme = require("./lib/theme")(app);
app.cms.frontend = require("./lib/frontend")(app);
app.cms.menus = require("./lib/menus")(app);
app.cms.pluginloader = require("./lib/plugin-loader")(app, server, app.cms.sockets);
app.cms.admin = require("./lib/admin")(app);
app.cms.packager = require("./lib/packager")(app);
app.cms.screens = require("./lib/screens")(app);
app.cms.appmenus = require("./lib/appmenus")(app);
require("./lib/optimism")(app);

server.listen(process.env.PORT || 3000)
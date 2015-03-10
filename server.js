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
app.cms.template = require("./lib/template")(app);
app.cms.frontend = require("./lib/frontend")(app);
app.cms.pluginloader = require("./lib/plugin-loader")(app, server, app.cms.sockets);
app.cms.admin = require("./lib/admin")(app);
app.cms.packager = require("./lib/packager")(app);
app.cms.menus = require("./lib/menus")(app);
app.cms.screens = require("./lib/screens")(app);
require("./lib/optimism")(app);

server.listen(process.env.PORT || 3000)
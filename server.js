var debug = require("debug")("cms");
var config = require("config");
var http = require("http");
var https = require("https");
var app = require("express")();
var bodyParser = require("body-parser");
var fs = require("fs");

// Regular HTTP Server
var server = http.createServer(app);

//Using HTTPS server
// http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server
// Generate keys like this
// $ openssl genrsa -out key.pem
// $ openssl req -new -key key.pem -out csr.pem
// $ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
// $ rm csr.pem

// var server = https.createServer({
//   key: fs.readFileSync('.sslcerts/key.pem'),
//   cert: fs.readFileSync('.sslcerts/cert.pem')
// }, app);

app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));

require("./lib/i18n")(app);
require("./lib/session")(app);
var sockets = require("./lib/sockets")(app, server);
require("./lib/installer")(app);
require("./lib/plugin-loader")(app, server, sockets);
require("./lib/template")(app);
require("./lib/frontend")(app);
require("./lib/admin")(app);
require("./lib/packager")(app);
server.listen(3000);
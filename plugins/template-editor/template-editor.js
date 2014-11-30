var noide = require("noide/src/lib/routes");

var routes = require('noide/src/lib/routes');
var middleware = require('noide/src/lib/middleware');
var sockets = require('noide/src/lib/sockets');

module.exports = function(app) {
  app.get("/admin/editor", function(req, res, next) {
    res.send("asd");
  });

}
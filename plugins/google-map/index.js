jade = require("jade");
read = require("fs").readFileSync;
module.exports = fun;

function fun(app) {
  app.locals.googlemaps = {}
  app.locals.googlemaps.map = function(options) {
    var file = read(__dirname + "/map.jade");
    return jade.render(file, options);
  };
}
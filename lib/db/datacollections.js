var debug = require("debug")("cms:datacollections");

var randomstring = require("randomstring");


module.exports = dbdatacollections;

function dbdatacollections(datacollections) {
  //var datacollections = db.get("datacollections");

  datacollections.create = function(cb) {
    var newDatacollection = {
      name: "datacollection" + randomstring.generate(3),
      title: "untitled Data Collection",
      timestamp: Date.now(),
    };
    debug("Trying to create empty data collection");

    datacollections.insert(newDatacollection, function(err, data) {
      if (err) {
        debug("error creating new empty data collection");
        return cb(err, data);
      }
      debug("data collection %s created", newDatacollection.name);
      cb(null, data);

    });
  };

  datacollections.all = function(callback) {
    datacollections.find({}, {
      sort: {
        menuWeight: 1
      }
    }, callback);
  }

  datacollections.get = function(id, cb) {
    datacollections.findOne({
      _id: id
    }, cb)
  }

  return datacollections;


}
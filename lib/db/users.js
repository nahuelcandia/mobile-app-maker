var bcrypt = require("bcryptjs"),
  debug = require("debug")("cms:users"),
  config = require("config").get("session");


module.exports = dbusers;

function dbusers(users) {
  //var users = db.get("users");

  users.login = function(username, password, cb) {
    if (!username || !password) {
      return cb(new Error("username or password blank"));
    }

    debug("Finding user %s", username);
    users.findOne({
      username: username,
      password: hash(password)
    }, function whenQueryBack(err, user) {
      if (err) {
        debug("user query failed");
        return cb(new Error("user query failed"));
      }
      if (!user) {
        debug("User not found");
        return cb(new Error("user not found"));
      }
      cb(null, userProfile(user));
    });
  };

  function userProfile(user) {
    return user;
  }

  function hash(password) {
    var _hash = bcrypt.hashSync(password, config.salt);
    return _hash;
  }
  return users;
}
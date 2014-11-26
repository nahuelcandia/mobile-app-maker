var bcrypt = require("bcrypt"),
  debug = require("debug")("cms:users");

var config = {
  salt: "$2a$10$phUYETiJArxNIGLh6P.ZSe"
};

module.exports = dbusers;

function dbusers(users) {
  //var users = db.get("users");

  users.login = function(username, password, cb) {
    if (!username || !password) {
      cb(new Error("username or password blank"));
    }

    debug("Finding user %s", username);
    users.findOne({
      username: username,
      password: hash(password)
    }, function whenQueryBack(err, user) {
      if (err) {
        debug("user query failed")
        return cb(new Error("user query failed"));
      }
      if (!user) {
        debug("monk user not found");
        return cb(new Error("user not found"));
      }
      cb(null, userProfile(user));
    });
  }

  function userProfile(user) {
    return user;
  }

  function hash(password) {
    var hash = bcrypt.hashSync(password, config.salt);
    return hash;
  }
  return users;
}
var debug = require("debug")("cms:session"),
  session = require("express-session"),
  JsonStore = require("./express-session-json")(session),
  sessionconfig = require("config").get("session"),
  join = require("path").join,
  users = require("../db").users;
/**
 * This modules creates an express session object based on express-session and
 * the npm module express-session-json in order for storing session data to a
 * local file instead of using mongo or Redis.
 *
 * Registers the middleware for protected URL routes admin/ , admin/*
 * Registers the URL route handlers for /login and /logout.
 *
 * @param {express.App} express request handler.
 * @param {Object} options.  request handler.
 *   - {Express session} session. An optional session middleware. You can pass
 *     `options.session` if your prefer another previously instantiated session
 *     middleware with some custom storage for example.
 */
module.exports = function(app, options) {
  var appSession;
  if ((typeof options !== "undefined") && options.session) {
    // User passed session middleware
    appSession = options.session;
  } else {
    debug("Creating session handler");
    debug(sessionconfig.jsonstore.path);
    appSession = session({
      secret: sessionconfig.secret,
      resave: true,
      saveUninitialized: true,
      store: new JsonStore({
        filename: sessionconfig.jsonstore.filename,
        path: join(process.cwd(), sessionconfig.jsonstore.path)
      })
    });
  }

  app.use(appSession);
  // Set the the session in the views scope
  app.use(makeSessionAvailableToViews);
  app.use("/admin*", restrict);
  app.get("/login", loginForm);
  app.post("/login", login);
  app.get("/logout", logout);
  //app.use(debugSession);

};

function makeSessionAvailableToViews(req, res, next) {
  res.locals.session = req.session;
  next();
}

// function debugSession(req, res, next) {
//   debug(req.session);
//   next();
// }
function restrict(req, res, next) {
  if (!req.session.user && req.path === "/login") {
    next();
  } else if (req.session.user) {
    next();
  } else {
    // If the request was a GET
    // store the PATH in session
    if (req.method === "GET") {
      req.session.lastIntendedPath = req.path;
    }
    //res.status(403).render("../admin/403");
    res.status(403).render("../admin/login");
  }
}

function loginForm(req, res) {
  res.render("../admin/login");
}

function login(req, res) {

  var username = req.param("username");
  var password = req.param("password");


  users.login(username, password, function(err, user) {
    if (err) {
      return res.redirect("/login");
    }
    req.session.regenerate(function() {
      req.session.user = user;
      res.redirect("/admin");
    });
  });
}

function logout(req, res) {
  req.session.destroy(function() {
    res.redirect("/");
  });
}
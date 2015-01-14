var debug = require("debug")("cms:session"),
  session = require("express-session"),
  JsonStore = require('express-session-json')(session),
  //cookieParser = require("cookie-parser"),
  users = require("../db").users;

module.exports = function(app, options) {
  var appSession;
  if ((typeof options !== 'undefined') && options.session) {
    // User passed session middleware
    appSession = options.session;
  } else {
    debug("Creating session handler");
    appSession = session({
      secret: "shovelapps-cms",
      resave: true,
      saveUninitialized: true,
      store: new JsonStore({
        filename: "session.json",
        path: process.cwd() + "/filestorage/.session"
      })
    });
  }

  app.use(appSession);
  // Set the the session in the views scope
  app.use(makeSessionAvailableToViews);
  app.use("/admin*", restrict);
  app.get("/login", loginForm);
  app.post('/login', login);
  app.get('/logout', logout);
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
    res.status(403).render('../admin/403');
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
      res.redirect('/admin');
    });
  });
}

function logout(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
}
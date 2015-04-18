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
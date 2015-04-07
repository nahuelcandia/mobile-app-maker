var debug = require("debug")("cms:theme"),
  config = require("config"),
  join = require("path").join,
  path = require("path"),
  basename = path.basename,
  walk = require('walkdir'),
  async = require("async"),
  paths = config.get("paths"),
  ejs = require("ejs"),
  themesdb = require("../db").themes;

module.exports = theme;
/**
 * - Sets default express theme engine to `jade`.
 * - Sets pretty output for jade if we are in development environment
 * - Sets default views path for express as an array in order to allow
 *
 * @param {express.App} express request handler
 */
function theme(app, themeName) {

}

theme.current = function(app, callback) {
  // If themes are already loaded in db

  if (app.locals.themes) {
    // Find marked as enabled
    theme.findEnabledTheme(app, function(themeName) {
      theme.enable(app, themeName, function() {
        callback(themeName);
      });
    });
  } else {
    theme.findInDirectory(app, function(themes) {
      if (typeof themeName === "undefined") {
        // Get default theme from config file
        // if no one passed to this module
        theme.findEnabledTheme(app, function(themeName) {
          theme.enable(app, themeName, function() {
            callback(themeName);
          });
        });

      }

    });
  }
}


theme.findEnabledTheme = function(app, callback) {
  themesdb.find({
    enabled: 1
  }, function(err, docs) {
    if (docs.length === 1) {
      if (app.locals.themes[docs[0].name]) {
        themeName = docs[0].name;
        debug("Found enabled theme '%s' in database", docs[0].name);
      } else {
        debug("Found enabled theme '%s', but it can't be found ...", docs[0].name);
        debug("... on '%s' directory. Maybe deleted? Using default: '%s'",
          config.get('paths.themesBase'), config.get('theme'));
        debug("You should either restore the missing theme directory or select a valid one");
        themeName = config.get("theme");
      }
    } else {
      themeName = config.get("theme");
    }
    callback(themeName);
  });
};

theme.enable = function(app, themeName, callback) {
  theme.requireTheme(app, app.locals.themes, themeName);
  debug("Calling app.set('theme', '%s')", themeName);
  app.set("theme", themeName);
  var themePath = join(paths.themesBase, app.get("theme"));
  debug("Setting express 'views' to %j", [themePath]);
  app.set("views", [themePath]);
  callback(themeName);
};

theme.requireTheme = function(app, themes, tpl) {
  try {
    debug("Trying to load index.js from '%s' theme's directory as a module", tpl);
    var index = require('../../themes/' + tpl + '/index.js');
    //themes[tpl].index = index;

    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      try {
        debug("Calling theme '%s' exported function (i.e. module.exports=function())", tpl);
        index(app, app.cms.server, app.cms.sockets);
      } catch (e) {
        console.warn("Error calling theme '%s' index function . The error was: %s", tpl, e.toString());
        console.warn(e.stack);
      }
    } else {
      debug("The index.js inside the theme directory does not export a function");
    }

  } catch (e) {
    if ("MODULE_NOT_FOUND" === e.code) {
      debug("This theme has no 'index.js' inside");
    } else {
      console.warn("Couldn't load 'index.js' for theme '%s'", basename(path));
      console.warn(e.stack);
    }
  }
};

/**
 * Handles the loading of themes from the themes directory.
 *
 * - This module loads the directories inside the themes directory using require.
 * - Will check if the theme (module) exports a function that will be called
 *   after the module being require()d.
 * - It will only consider directories that have an index.js file inside and that
 *   index.js is the entry point for the module.
 * - If there's an error in the call to require(), the error is catched and the theme
 *   is not loaded. The CMS won't crash if an error is thrown by require().
 * - Sets app.locals.themes with the list of loaded themes, thus making it
 *   available to the views. Each of the items of the locals.themes has the
 *   companion package.json for each loaded theme.
 *   When the theme is required, this module calls the
 * @param {express.App} app. express request handler.
 * @param {Server} server. HTTP/HTTPS server.
 * @param {Object} sockets. The sockets provided by lib/sockets.
 *   - {io.Manager} ioManager a socket.io manager instance,
 *   - {Socket} platform: client socket to platform builder services,
 *   - {Socket} adminPanel: server socket to adminPanel interface,
 *   - {Socket} frontend: server socket for web frontend
 */

theme.findInDirectory = function(app, callback) {
  var themes = [];
  app.locals.themes = {};
  debug("Finding themes in directory %s", join(process.cwd(), 'themes'))
  try {
    walk.sync(join(process.cwd(), config.get('paths.themesBase')), {
        "follow_symlinks": false, // default is off
        "no_recurse": true, // only recurse one level deep
        "max_depth": undefined // only recurse down to max_depth. if you need more than no_recurse
      },
      function(path, stat) {
        if (stat.isDirectory()) {

          debug("Found theme '%s'", basename(path));
          if (path.lastIndexOf('admin') < 0) {
            var defaults = {};
            var tpl = path.split('/')[path.split('/').length - 1];
            themes[tpl] = {
              metadata: {}
            };
            try {
              defaults = require('../../themes/' + tpl + '/defaults.json');
            } catch (e) {
              //debug("Theme defaults.json not found");
            }
            themes[tpl].defaults = defaults;

          }
        }
      });
  } catch (e) {
    console.error("theme-loader errored: %s", e.stack);
    debug("theme-loader errored: %j", e);
    return;
  }

  app.locals.themes = themes;
  saveThemes(themes, callback);
  // Object.keys(themes).forEach(function(tpl) {

  //   saveTheme(tpl, themes[tpl].defaults, themes[tpl].metadata);
  // });

  return true;
};

function saveThemes(themes, callback) {
  async.each(Object.keys(themes), function(k, done) {
    saveTheme(k, themes[k], done)
  }, function(err) {
    callback()
  });

}

/**
 * Saves the state of a theme to the DB.
 *
 * @param {String} k. The id/name of a theme (usually the directory name of the theme)
 */
function saveTheme(k, theme, done) {
  var config = theme.config,
    metadata = theme.metadata;

  themesdb.find({
    name: k
  }, function(err, docs) {
    var key = k;
    if (docs.length < 1) {
      themesdb.insert({
        name: key,
        enabled: 0,
        timestamp: Date.now(),
        config: config,
        metadata: metadata
      }, function(err) {
        if (err) {
          debug("I errored loading theme into db: " + key);
          done(err);
        } else {
          debug("I loaded theme into db: " + key);
          done();
        }
      });
    } else {
      done();
    }
  });
}

/**TESTING
 * Returns if the theme exists and is "usable"
 * Checks if path exists and if it has, at least
 * an index.html or index.jade
 *
 * @param: {String} themeName: the (directory)name of the theme
 */
function themeIsUsable(themeName) {
  var themePath = join(process.cwd(), config.get('paths.themesBase'), themeName);
  //check path exists
  //check path holds index.html/index.jade/index.js?
}
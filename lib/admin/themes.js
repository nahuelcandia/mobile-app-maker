var db = require("../db");
var debug = require("debug")("cms:themes");
var themes = require("../db").themes;
var theme = require("../theme");
var bodyParser = require("body-parser");
var walk = require("walk");
var fs = require("fs");
var path = require("path");
/**
 * Registers URL routes for altering themes' state
 *
 * @param {express.App} express request handler.
 */
module.exports = function(app) {

  app.cms.menus.registerAdminGroupMenu({
    title: 'Themes',
    description: 'Manage current themes or add a new one',
    icon: 'ion-code-working',
    weight: 4
  }, [{
    title: 'Manage themes',
    href: '/admin/themes'
  }, {
    title: 'Add theme',
    href: '/admin/themes'
  }]);
  app.use(bodyParser.json());
  app.get("/admin/themes", function(req, res) {
    debug("Accesed themes page");
    db.themes.all(function(err, docs) {
      res.render("../admin/themes", {
        componentType: 'theme',
        componentTypePlural: 'themes',
        components: app.locals.themes,
        states: docs
      });

    });
  });

  // validar req.params.name que matchee con app.locals.themes

  app.get("/admin/theme/:name", viewTheme);
  app.get("/admin/theme/edit/:name", editTheme);
  app.post("/admin/theme/edit/:name/:thefile", saveTheme);
  app.get("/admin/theme/delete/:name", deleteTheme);
  app.get("/admin/theme/toggle/:name", toggleTheme);
  app.get("/admin/theme/config/:name", getConfig);
  app.post("/admin/theme/get/:name", readThemeFile);
  app.post("/admin/theme/config/:name", setConfig);
};

function listThemeDir(filename, theme, level) {
  var ext = filename.split('.')[filename.split('.').length - 1];
  var extensions = ['css', 'html', 'js', 'less', 'jade', 'json'];
  var blacklisted_suffixes = ['.min.css', '.min.js'];
  var rootPath = process.cwd() + '/themes/' + theme;
  var relativePath = filename.substr(rootPath.length, filename.length);

  var stats = fs.lstatSync(filename);
  var isDirectory = stats.isDirectory();
  var editable = (ext in extensions ? true : false);
  //if (isDirectory || (extensions.indexOf(ext) >= 0 && blacklisted_suffixes.indexOf(filename.split('.')[filename.split('.').length - 2]) >= 0)) {

  var tree = {
    id: relativePath,
    label: path.basename(filename),
    theme: theme,
    path: relativePath,
    editable: editable
  };
  if (isDirectory) {
    tree.icon = 'folder';
    tree.inode = true;
    tree.open = (level == 0 ? true : false);
    tree.branch = fs.readdirSync(filename).map(function(child) {
      return listThemeDir(filename + '/' + child, theme, level + 1);
    });
  } else {
    tree.icon = 'file';
    tree.inode = false;
    tree.format = ext;
  }

  return tree;
  //callback(tree);
}

function editTheme(req, res) {
  debug("Accesed theme editing page: " + req.params.name);

  themes.find({
    name: req.params.name
  }, function(err, docs) {

    var source = '';
    var themeFiles = {
      editable: []
    };

    var path = process.cwd() + '/themes/' + req.params.name;
    var tree = listThemeDir(path, req.params.name, 0);

    res.render("../admin/component-editor", {
      componentType: 'theme',
      componentTypePlural: 'themes',
      component: docs,
      source: source,
      tree: tree,
      theme: req.params.name
    });

  });
}

function readThemeFile(req, res) {

  var path = process.cwd() + '/themes/' + req.params.name;
  var file = req.body.file;
  fs.exists(path + file, function(exists) {
    if (exists) {
      res.sendfile(path + file);
    } else {
      res.status(404).send('File does not exist');
    }
  });
}


function saveTheme(req, res, next) {
  var content = '';
  req.on('data', function(data) {
    // Append data.
    content += data;
  });
  req.on('end', function() {
    // Assuming, we're receiving JSON, parse the string into a JSON object to return.
    var data = content;
    fs.writeFile(process.cwd() + '/themes/' + req.params.name + '/' + req.params.thefile, data);
    return res.type('application/json').status(200).send('ok');
  });
}
/**
 * Middleware for setting the current active theme
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function setTheme(app, name, callback) {
  theme.enable(app, name, callback);
}
/**
 * Middleware for handling the deletion of a theme
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function deleteTheme(req, res) {
  themes.remove({
    name: req.params.name
  }, function(err) {
    if (err) {
      return res.send(500, "I errored");
    }
    return res.send(200, "Deleted");
  });
}
/**
 * Middleware for handling the activation/deactivation of a theme
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function toggleTheme(req, res) {

  themes.update({
      name: {
        $ne: req.param.name
      }
    }, {
      $set: {
        enabled: 0
      }
    }, {
      multi: true
    },
    function(err) {
      if (err) {
        return res.send(500, "I errored");

      }
    });

  themes.find({
    name: req.params.name
  }, function(err, docs) {
    if (docs.length === 1) {
      themes.update({
        name: req.params.name
      }, {
        $set: {
          enabled: (docs[0].enabled === 1 ? 0 : 1)
        }
      }, function(err) {
        if (err) {
          return res.send(500, "I errored");
        }
        var state = (docs[0].enabled === 1 ? 'disabled' : 'enabled');
        if (state === 'enabled') {
          setTheme(req.app, req.params.name, function(themeName) {
            return res.type('application/json').status(200).send('{"state": "' + state + '", "key": "' + req.params.name + '"}');
          });
        }
      });
    } else {
      debug('theme not found');
    }
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });
}
/**
 * Middleware for rendering the detailed view of a theme
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function viewTheme(req, res) {
  debug("Accesed theme page: " + req.params.name);

  themes.find({
    name: req.params.name
  }, function(err, docs) {
    res.render("../admin/theme", {
      componentType: 'theme',
      componentTypePlural: 'themes',
      component: docs
    });
  });
}

function getConfig(req, res, next) {


}

function setConfig(req, res) {
  var newConfig = req.body;
  themes.update({
    name: req.params.name
  }, {
    $set: {
      config: newConfig
    }
  }, function(err) {
    debug(err);
    return res.type('application/json').status(200).send('ok');
  });
}
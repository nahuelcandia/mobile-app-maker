var db = require("../db");
var debug = require("debug")("cms:templates");
var templates = require("../db").templates;
var template = require("../template");
var bodyParser = require("body-parser");
var walk = require("walk");
var fs = require("fs");
/**
 * Registers URL routes for altering templates' state
 *
 * @param {express.App} express request handler.
 */
module.exports = function(app) {

  app.use(bodyParser.json());
  app.get("/admin/templates", function(req, res) {
    debug("Accesed templates page");
    db.templates.all(function(err, docs) {
      res.render("../admin/components", {
        componentType: 'template',
        componentTypePlural: 'templates',
        components: app.locals.templates,
        states: docs
      });

    });
  });

  // validar req.params.name que matchee con app.locals.templates

  app.get("/admin/template/:name", viewTemplate);
  app.get("/admin/template/edit/:name", editTemplate);
  app.post("/admin/template/edit/:name", saveTemplate);
  app.get("/admin/template/delete/:name", deleteTemplate);
  app.get("/admin/template/toggle/:name", toggleTemplate);
  app.get("/admin/template/config/:name", getConfig);
  app.post("/admin/template/config/:name", setConfig);
};

function editTemplate(req, res) {
  debug("Accesed template editing page: " + req.params.name);

  templates.find({
    name: req.params.name
  }, function(err, docs) {

    var source = '';
    var templateFiles = {
      editable: []
    };
    var walker = walk.walk(process.cwd() + '/templates/' + req.params.name, {
      followLinks: false
    });

    var extensions = ['css', 'html', 'js', 'less', 'jade', 'json'];
    var blacklisted_suffixes = ['.min.css', '.min.js'];
    walker.on('file', function(root, stat, next) {
      // Add this file to the list of files
      //files.push(process.cwd() + '/templates/' + req.params.name + '/' + stat.name);
      debug(root);
      var ext = stat.name.split('.')[stat.name.split('.').length - 1];
      if (extensions.indexOf(ext) >= 0 && blacklisted_suffixes.indexOf(stat.name.split('.')[stat.name.split('.').length - 2]) >= 0) {
        console.log(root + '/' + stat.name);
        fs.readFile(root + '/' + stat.name, function read(err, data) {
          if (err) {
            throw err;
          }
          templateFiles.editable.push({
            name: stat.name,
            body: data.toString('utf8')
          });
        });
      }
      next();
    });
    walker.on('end', function() {
      debug(templateFiles);
      templateFiles.editable.forEach(function(file) {
        debug(file.name);
        //node.children.push({
        //  id:id,
        //  title:'Node ' + id,
        //  has_children:hasChildren,
        //  level: node.level + 1,
        //  children:[]
        //});
      });
      fs.readFile(process.cwd() + '/templates/' + req.params.name + '/index.jade', function read(err, data) {
        if (err) {
          throw err;
        }
        source = data.toString('utf8');
      });
      var tree = [];
      res.render("../admin/component-editor", {
        componentType: 'template',
        componentTypePlural: 'templates',
        component: docs,
        source: source,
        tree: tree
      });
    })
  });
}

function saveTemplate(req, res) {

}

function setTemplate(app, name, callback) {
  template.enable(app, name, callback);
}
/**
 * Middleware for handling the deletion of a template
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function deleteTemplate(req, res) {
  templates.remove({
    name: req.params.name
  }, function(err) {
    if (err) {
      return res.send(500, "I errored");
    }
    return res.send(200, "Deleted");
  });
}
/**
 * Middleware for handling the activation/deactivation of a template
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function toggleTemplate(req, res) {

  templates.update({
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

  templates.find({
    name: req.params.name
  }, function(err, docs) {
    if (docs.length === 1) {
      templates.update({
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
          setTemplate(req.app, req.params.name, function(templateName) {
            return res.type('application/json').status(200).send('{"state": "' + state + '", "key": "' + req.params.name + '"}');
          });
        }
      });
    } else {
      debug('template not found');
    }
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });
}
/**
 * Middleware for rendering the detailed view of a template
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 */
function viewTemplate(req, res) {
  debug("Accesed template page: " + req.params.name);

  templates.find({
    name: req.params.name
  }, function(err, docs) {
    res.render("../admin/component", {
      componentType: 'template',
      componentTypePlural: 'templates',
      component: docs
    });
  });
}

function getConfig(req, res, next) {


}

function setConfig(req, res) {
  var newConfig = req.body;
  templates.update({
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
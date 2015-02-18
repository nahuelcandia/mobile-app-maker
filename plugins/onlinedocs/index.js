var fs = require('fs'),
  md = require('github-flavored-markdown').parse;


module.exports = onlinedocs;


function onlinedocs(app) {




  // register .md as an engine in express view system

  app.engine('md', function(path, options, fn) {
    fs.readFile(path, 'utf8', function(err, str) {
      if (err) return fn(err);
      try {
        var html = md(str);
        html = html.replace(/\{([^}]+)\}/g, function(_, name) {
          return options[name] || '';
        })
        fn(null, html);
      } catch (err) {
        fn(err);
      }
    });
  });


  app.get('/admin/docs/', function(req, res) {
    res.render('../../docs/index.md', {
      title: 'Markdown Example'
    });
  });





}
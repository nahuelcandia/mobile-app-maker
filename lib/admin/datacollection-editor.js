var uuid = require("node-uuid"),
  debug = require("debug")("cms:screen-editor"),
  datacollections = require("../db").datacollections;

module.exports = function(app) {
  app.get("/admin/datacollections/create", createDatacollection);
  app.get("/admin/datacollections/delete/:name", deleteDatacollection);
  app.get("/admin/datacollections/update/:name", editDatacollection);
  app.post("/admin/datacollections/update/:name", updateDatacollection);
}

function createDatacollection(req, res, next) {
  datacollections.create(function(err, data) {
    if (err) {
      debug("error creating new screen");
      res.status(500).send(err.toString());
      return;
    }
    debug("Screen saved");
    res.redirect("/admin/datacollections/update/" + data.name);
  });

}

function deleteDatacollection(req, res, next) {
  datacollections.remove({
    name: req.params.name
  }, function(err) {
    if (err) {
      return res.send(500, "I errored");
    }
    res.redirect("/admin");

  })
}

function editDatacollection(req, res, next) {
  datacollections.findOne({
    name: req.params.name
  }, function(err, data) {
    if (err) {
      return res.send(500, "I errored");
    }
    res.render("../admin/datacollection-editor", {
      screen: data
    });

  })
}

function updateDatacollection(req, res, next) {
  debug(req.param("title"));
  datacollections.updateById(req.params.id, {
    title: req.param("title"),
    slug: req.param("slug"),
    html: req.param("html"),
    menuWeight: req.param("menuWeight")
  }, function(err, data) {
    if (err) {
      return res.send(500, "I errored");
    }
    res.json({
      screen: data
    })

  })
}
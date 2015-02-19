var storage = require("filestorage"),
  debug = require("debug")("cms:filestorage"),
  join = require("path").join,
  config = require("config").get("filestorage");

debug("Creating uploads storage");
var uploadsPath = join(process.cwd(), config.basePath, "uploads");
module.exports = storage.create(uploadsPath);
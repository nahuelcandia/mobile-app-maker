var storage = require("filestorage"),
  debug = require("debug")("cms:filestorage"),
  join = require("path").join,
  config = require("config").get("filestorage");

debug("Creating uploads storage");
module.exports = storage.create(join(process.cwd(), config.basePath, "uploads"));
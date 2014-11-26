storage = require("filestorage");
debug = require("debug")("cms:filestorage");
join = require("path").join;

config = {
  basePath: "filestorage"
}

module.exports = {
  uploads: storage.create(join(process.cwd(), config.basePath, "uploads"))
};
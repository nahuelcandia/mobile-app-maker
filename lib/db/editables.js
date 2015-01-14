var debug = require("debug")("cms:db:editables");

module.exports = editablesModule;

function editablesModule(editables) {

  editables.saveEdition = function(updatedEditable, callback) {

    debug("Trying to save editable");
    editables.update({
        editableId: updatedEditable.id
      }, {
        editableId: updatedEditable.id,
        html: updatedEditable.html,
        timestamp: Date.now()
      }, {
        upsert: true
      },
      callback);

  };

  editables.all = function(callback) {
    editables.find({}).sort({
      editableId: 1
    }).exec(callback);
  };

  return editables;
}
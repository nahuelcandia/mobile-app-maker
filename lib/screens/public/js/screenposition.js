/*
 * Extensive use of https://github.com/jpillora/jquery.rest
 */
$(function() {
  screenposition();
});

function screenposition() {
  if (!(this instanceof screenposition)) {
    return new screenposition();
  }
  this.client = new $.RestClient("/admin/");
  this.client.add("screens");
  this.client.screens.addVerb('position', 'PATCH');
  this.initUpdatePosition();
}

screenposition.prototype = {
  initUpdatePosition: function() {
    var _this = this;
    $("#sortableScreens").sortable({
      stop: function(event, ui) {
        $("#sortableScreens").sortable("refreshPositions");
        $("#sortableScreens").children().each(function() {
          var index = $(this).index();
          index = index.toString();
          _this.client.screens.position($(this).attr('id'), {
            position: index
          });
        });
      }
    });
  }
};
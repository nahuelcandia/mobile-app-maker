$(function() {
  setMain();
});

function setMain() {
  if (!(this instanceof setMain)) {
    return new setMain();
  }
  this.client = new $.RestClient("/admin/");
  this.client.add("screens");
  this.client.screens.addVerb('main', 'PATCH');
  this.initsetMain();
}

setMain.prototype = {
  initsetMain: function() {
    var _this = this;
    $(".row").on("change", "#selectMain", function(e) {
      $('#selectMain option').each(function(index) {
        if ($(this).val() == $('#selectMain').val()) {
          _this.client.screens.main($(this).val(), {
            isMain: true
          });
        } else {
          if ($(this).val() !== 'not selected') {
            _this.client.screens.main($(this).val(), {
              isMain: false
            });
          }
        }
      });
      e.preventDefault();
    });
  }
};
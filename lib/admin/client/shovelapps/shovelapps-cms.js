/*global $:false */
/*global io:false */
/*global MediumEditor:false */
/*global __:false */


function setBuildByButton() {
  var $buildButton = $("#build"),
    socket = io.connect("/admin");
  socket.on("platform connect", function() {
    // Disable the button until we get the socket
    socket.emit("already working?");
    socket.on("doin nothing", function() {
      $buildButton.removeClass("disabled btn-default")
        .addClass("btn-success").find('.btn-text.hidden-xs').html(__("Build android binary..."));
      $buildButton.find('.btn-text.visible-xs').html(__("Build..."));
    });
  });
  socket.on("platform disconnect", function() {
    // Disable the button until we get the socket
    $buildButton.find('.btn-text.hidden-xs').text(__("Platform not reachable")).addClass("disabled btn-default")
      .removeClass("btn-success");
    $buildButton.find('.btn-text.visible-xs').html(__("Disconnected"));
  });



  socket.on("source code upload progress", function(data) {
    $buildButton.removeClass("btn-success")
      .addClass("btn-default")
      .addClass("disabled");
    $buildButton.find('.btn-text.hidden-xs').html(__("Uploading source code..."));
    $buildButton.find('.btn-text.visible-xs').html(__("Uploading"));
    $buildButton.find('#upload-progress').html(data.progress).show();
  });
  socket.on("upload-complete", function() {
    // Upload complete - now building
    $buildButton.removeClass("btn-success")
      .addClass("btn-warning")
      .addClass("disabled");
    $buildButton.find('.hidden-xs.btn-text').html(__("Building Android binary..."));
    $buildButton.find('.visible-xs.btn-text').html(__("Building..."));
    $buildButton.find('#upload-progress').hide();
  });
  socket.on("apkbuilt", function(data) {
    $("#downloadapklink").removeClass("hidden")
      .show().attr("href", data.url);

    $(".downloadapkqrcode").html('');
    $(".downloadapkqrcode.hidden-xs").removeClass("hidden")
      .qrcode({
        "color": "#3a3",
        "text": data.url
      });
    $(".downloadapkqrcode.visible-xs").removeClass("hidden")
      .qrcode({
        "color": "#3a3",
        "text": data.url,
        "size": 105
      });
    $buildButton.removeClass("btn-warning")
      .removeClass("disabled")
      .addClass("btn-success");
    $buildButton.find('.hidden-xs.btn-text').html(__("Build again"));
    $buildButton.find('.visible-xs.btn-text').html(__("Build"));
  });
  $buildButton.on("click", function onBuildClick() {

    $buildButton.find('.hidden-xs.btn-text').html(__("Compressing app..."));
    $buildButton.find('.visible-xs.btn-text').html(__("Zipping..."));
    // Skip if we're already building
    if ($(this).hasClass("building")) {
      //return;
    }
    $buildButton.addClass("building");
    socket.emit("buildApk");
    return false;
  });
}

function initEditor(edit) {
  var editing = (typeof edit === 'undefined' ? false : true);
  var $editables = $("[data-editable!=''][data-editable]"),
    $editToggle = $("#editToggle"),
    editors;
  $editToggle.on("click", toggleEditing);

  if (editing) {
    enableEditing();
  }

  function toggleEditing() {
    console.log(editing);
    if (editing) {
      disableEditing();
    } else {
      enableEditing();
    }
  }

  function enableEditing() {
    $editables.addClass("editable");
    $editables.on("mouseenter", frameEditable)
      .on("mouseleave", unframeEditable);
    // Save the editable's content
    $editables.on("blur", saveEditableOnBlur);
    if (!editors) {
      // If we haven't created the editors yet
      // They're .activate()d by default
      editors = mediumEditors();
    } else {
      editors.regular.activate();
      editors.inline.activate();
    }
    editing = true;
    $editToggle.find(".item-title").html(__("Editing..."));
  }

  function disableEditing() {
    $editables.off("mouseenter", frameEditable)
      .off("mouseleave", unframeEditable);
    // Disable the saving of the editable's content
    $editables.off("blur", saveEditableOnBlur);
    editors.regular.deactivate();
    editors.inline.deactivate();

    editing = false;
    $editToggle.find(".item-title").html(__("Edit"));
  }

  function saveEditableOnBlur() {
    var editable = {
      id: $(this).attr("data-editable"),
      html: $(this).html()
    };
    saveEditable(editable);
  }

  function saveEditable(editable) {
    $.post("/admin/editable/", editable, function() {
      console.log(__("Editable saved"));
    }).fail(function() {
      console.log(__("Editable not saved"));
    });
  }


  function frameEditable() {
    // This should be an addClass/removeClass
    $(this).css("border", "1px dashed blue");
  }

  function unframeEditable() {
    $(this).css("border", "none");
  }

  function mediumEditors() {
    var defaultEditorButtons = ['bold', 'italic', 'underline', 'anchor',
      'header1', 'header2', 'quote'
    ];
    var editors = {
      inline: new MediumEditor(".editable-inline", {
        disableReturn: true,
        // disableEditing: true,
        buttons: []
      }),
      regular: new MediumEditor(".editable", {
        //disableReturn: true,
        forcePlainText: true,
        cleanPastedHTML: true,
        // disableEditing: true,
        buttons: defaultEditorButtons.concat(["button", 'justifyCenter',
          "image"
        ]),
        extensions: {
          // 'screen-anchor': new MediumButton({
          //   label: '#Screen',
          //   start: '<a data-toggle="tab">',
          //   end: '</a>',
          //   action: function(html, mark) {
          //     console.log(html, mark);
          //     editors.regular.showAnchorForm();
          //   }
          // })
        }
      })
    };

    return editors;
  }

}
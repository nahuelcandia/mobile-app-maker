/*global $:false */
/*global io:false */
/*global MediumEditor:false */
/*global ace:false */

function setBuildByButton() {
  var $buildButton = $("#build"),
    socket = io.connect("/admin");
  socket.on("platform connect", function() {
    // Disable the button until we get the socket
    socket.emit("already working?");
    socket.on("doin nothing", function(data) {
      $buildButton.removeClass("disabled btn-default")
        .addClass("btn-success").find('.btn-text').html("Build android binary...");
    });
  });
  socket.on("platform disconnect", function() {
    // Disable the button until we get the socket
    $buildButton.find('.btn-text').text("Platform not reachable").addClass("disabled btn-default")
      .removeClass("btn-success");
  });



  socket.on("source code upload progress", function(data) {
    $buildButton.removeClass("btn-success")
      .addClass("btn-default")
      .addClass("disabled");
    $buildButton.find('.btn-text').html("Uploading source code...");
    $buildButton.find('#upload-progress').html(data.progress);
  });
  socket.on("upload-complete", function(data) {
    // Upload complete - now building
    $buildButton.removeClass("btn-success")
      .addClass("btn-warning")
      .addClass("disabled");
    $buildButton.find('.btn-text').html("Building Android binary...");
    $buildButton.find('#upload-progress').text();
  });
  socket.on("apkbuilt", function(data) {
    $("#downloadapklink").removeClass("hidden")
      .show().attr("href", data.url);
    $("#downloadapkqrcode").removeClass("hidden")
      .qrcode({
        "color": "#3a3",
        "text": data.url
      });
    $buildButton.removeClass("btn-warning")
      .removeClass("disabled")
      .addClass("btn-success");
    $buildButton.html("Build again");
  });
  $buildButton.on("click", function onBuildClick() {
    // Skip if we're already building
    if ($(this).hasClass("building")) {
      //return;
    }
    $buildButton.addClass("building");
    socket.emit("buildApk");
    return false;
  });
}

function initEditor() {
  var editing = false;
  var $editables = $("[data-editable!=''][data-editable]"),
    $editToggle = $("#editToggle"),
    editors;
  $editToggle.on("click", toggleEditing);

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
    $editToggle.find(".item-title").html("Editing...");
  }

  function disableEditing() {
    $editables.off("mouseenter", frameEditable)
      .off("mouseleave", unframeEditable);
    // Disable the saving of the editable's content
    $editables.off("blur", saveEditableOnBlur);
    editors.regular.deactivate();
    editors.inline.deactivate();

    editing = false;
    $editToggle.find(".item-title").html("Edit");
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
      console.log("Editable saved");
    }).fail(function() {
      console.log("Editable not saved");
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

function initScribe() {
  require({

  }, [
    'scribe',
    'scribe-plugin-smart-lists',
    'scribe-plugin-toolbar',
    'scribe-plugin-link-prompt-command'
  ], function(
    Scribe,
    scribePluginSmartLists,
    scribePluginToolbar

  ) {
    //initScribe();

    function initScribe() {
      var scribe = new Scribe(document.querySelector('.editable'), {
        allowBlockElements: true
      });

      scribe.use(scribePluginSmartLists());
      //scribe.use(scribePluginToolbar(document.querySelector('.toolbar')));



      // $editable = $(".editable");
      scribe.on('content-changed', function() {
        console.log("content changed on scribe editor");
        console.log("user inputted on scribe");
        $(this).trigger("change", scribe.getHTML());
      });
      // $("#sourcecode").on("change", function(ev, html) {
      //   console.log("trying to update scribe editor")
      //   scribe.setContent(html);
      // });
    }
  });

}





function aceEditor() {
  var aceEditors = [];
  $("#sourcecode").each(function() {
    // var htmlSource = $("<div/>").text($(this).html()).html();
    // $(this).text(htmlSource);

    var editor = ace.edit($(this).get(0));
    aceEditors.push(editor);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");

    // var $editor = $(this);
    // editor.on("input", function() {
    //   console.log("source code changed");
    //   console.log(editor.getValue());
    //   $editor.trigger("change", editor.getValue());
    // })

    $(".editable").on("change", function(ev, html) {
      console.log("trying to update ace editor");
      console.log(arguments);
      editor.setValue(html);
    });

  });



}
function setBuildByButton() {
  var $buildButton = $("#build");
  var socket = io.connect("/");
  socket.on("platform connect", function() {
    // Disable the button until we get the socket
    $buildButton.text("Build mobile app").removeClass("disabled btn-default")
      .addClass("btn-success");
  });
  $buildButton.on("click", function onBuildClick() {

    // Skip if we're already building
    if ($(this).hasClass("building")) {
      //return;
    }
    $buildButton.addClass("building");
    $buildButton.removeClass("btn-success")
      .addClass("btn-default")
      .addClass("disabled");
    $buildButton.html("Uploading source code...");
    socket.emit("buildApk");
    socket.on("progress", function() {
      console.info("ordem e progreso");
    });
    socket.on("upload-complete", function() {
      $buildButton.removeClass("btn-default").addClass("btn-warning");
      $buildButton.html("Building Android binary...");
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

    })
    return false;
  });
}

function initEditor() {
  var $editables = $("[data-editable!=''][data-editable]")
  enableEditing();
  mediumEditor();

  $("[data-editable]").on("blur", function() {
    var editable = {
      id: $(this).attr("data-editable"),
      html: $(this).html()
    }
    saveEditable(editable);
  });

  function saveEditable(editable) {
    $.post("/admin/editable/", editable, function() {
      console.log("Editable saved");
    }).fail(function() {
      console.log("Editable not saved");
    });
  }

  function enableEditing() {
    $editables.addClass("editable");
    $editables.on("mouseenter", function() {
      $(this).css("border", "1px dashed blue");
    }).on("mouseleave", function() {
      $(this).css("border", "none");
    });
  }
  //$("[data-editable-inline]").addClass("editable-inline");


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
      console.log("trying to update ace editor")
      console.log(arguments);
      editor.setValue(html);
    })

  });



}

function mediumEditor() {
  var defaultEditorButtons = ['bold', 'italic', 'underline', 'anchor',
    'header1', 'header2', 'quote'
  ];
  var editors = {
    inline: new MediumEditor(".editable-inline", {
      disableReturn: true,
      buttons: []
    }),
    regular: new MediumEditor(".editable", {
      //disableReturn: true,
      forcePlainText: true,
      cleanPastedHTML: true,
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
}
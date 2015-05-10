/* #License 
 *
 * The MIT License (MIT)
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 *
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

 /*global $:false */
 /*global io:false */
 /*global MediumEditor:false */
 /*global __:false */


  var addBuild = function(){
    var newRow = $(".publish-history-table thead tr").clone().addClass("lastBuild");
    var th = newRow.find("th");
    

    newRow.css("background", "#FCFBB8").hide();

    th.eq(0).text((new Date()).toDateString());
    th.eq(2).text("");
    th.eq(3).addClass("devices").text("Building...");
    th.eq(4).text("");
    th.eq(5).text("");

     $(".publish-history-table tbody").append(newRow);

     newRow.fadeIn();
  };

  var addButtonToLastBuild = function(data){
    var row = $(".lastBuild:last");
    var th = row.find("th");

    row.css("background", "");

    var android = $("<a>", {href: data.url, target: "_blank"}).addClass("android small");
    var os = $("<div>").addClass("os").append(android);

    th.eq(3).html("").append(os);


    var qr = $("<a>", {"href": '#', "data-toggle": "modal", "data-target": "#qr-modal", "data-uri": data.url, "data-buildid": ""}).append($("<span>").addClass("glyphicon glyphicon-qrcode"));

    th.eq(4).append(qr);

    var dele = $("<a>", {"href": "#"}).append($("<span>").addClass("delete"));

    th.eq(5).append(dele);
  };

 function setBuildByButton() {
   var buildAndroid = $(".btn.build.android");
   var socket = io.connect("/admin");

   socket.on("platform connect", function() {
    // Disable the button until we get the socket
    socket.emit("already working?");
    socket.on("doin nothing", function() {
      if(!buildAndroid.data("building")) return;
      buildAndroid.find("span").text("Build..");
    });
  });
   socket.on("platform disconnect", function() {
    // Disable the button until we get the socket
    buildAndroid.prop("disabled", false).find("span").text("Error");
  });



   socket.on("source code upload progress", function(data) {
    buildAndroid.find("span").text(data.progress);
  });
   socket.on("upload-complete", function() {
    // Upload complete - now building
    buildAndroid.find("span").text("Build..");
  });
   socket.on("apkbuilt", function(data) {
    console.log(data);

    window.location = data.url;
    buildAndroid.data("building", false).data("href", data.url).prop("disabled", false).find("span").text(".APK");

    addButtonToLastBuild(data);
  });
   buildAndroid.on("click", function onBuildClick() {
    buildAndroid.prop("disabled", true).find("span").text("0%");

    buildAndroid.data("building", true);

    socket.emit("buildApk");

    addBuild();

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
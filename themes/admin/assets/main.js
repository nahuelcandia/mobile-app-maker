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

 $(function() {
  $(document).on("click", ".dropdown.keep-open .dropdown-menu", function(e) {
    e.stopPropagation();
  });

  $(document).on("click", ".shovel-group-panel .panel-heading[data-toggle]", function(e) {
    $(this).parent(".panel").toggleClass("open");
  });

  /*if($('.select2').length && typeof $('.select2').select2 != "undefined")
		{
			$('.select2').select2();
		}*/

    $(document).on("click", ".up-arrow", function() {
      $("html, body").animate({
        scrollTop: 0
      });
    });

    $(document).on("change", ".information-build .addscreen input[type='file']", function(){
      if(!("files" in this) ||  this.files.length == 0 || URL === undefined)
        return;

      if(this.files[0].type.indexOf("image/") == 0)
      {
        $(this).find("~ img").remove(), 
        $(this).after($("<img>").attr("src", URL.createObjectURL(this.files[0])));
      }
    });

    $(document).on("change", ".dropdown-menu .attach input[type='file']", function(){
      if("files" in this && this.files.length == 0)
        return;

      var filename = "files" in this ? this.files[0].name : $(this).val().split('\\').pop();
      $(this).find("~ span:first").text(filename);
    });

    $(document).on("change", ".cms.settingsapp .attach-icon input[type='file']", function(){
      if(!("files" in this) ||  this.files.length == 0 || URL === undefined)
        return;

      if(this.files[0].type.indexOf("image/") == 0)
      {
        $(this).find("~ img").remove(), 
        $(this).after($("<img>").attr("src", URL.createObjectURL(this.files[0])));
      }
    });

    $(document).on("click", ".list-selects .header input[type='checkbox']", function(){
      $(this).parents(".list-selects").find("li input[type='checkbox']").prop("checked", $(this).is(':checked'));
    });

    $(document).on("click", ".list-selects .list li input[type='checkbox']", function(){
      var checks = $(this).parents(".list").find("li input[type='checkbox']");
      var count = 0;

      for(var i = 0; i < checks.length; i++)
      {
        checks.eq(i).is(':checked') && ++count;
      }

      $(this).parents(".list-selects").find(".header input[type='checkbox']:first").prop("checked", count == checks.length);
    });




    // actions


    $(".publish-history-table").length > 0 && (function(){
      $(document).on("click", ".publish-history-table .delete", function(){
          var parent = $(this).parents("tr");
          parent.fadeOut(function(){parent.remove();});
          return false;
      });
    })();

    window.history.length > 1 && $(".back-button").length > 0 && (function(){
      $(".back-button").on("click", function(){ window.history.back(); return false;});
    })();
    window.history.length == 1 && (function(){
      $(".back-button").hide();
    })();


    $(".plugins").length > 0 && (function(){
      $(".search input").on("keyup", function(){
        var val = $(this).val().toLocaleLowerCase().trim();

        if(val == "")
        {
          $(".plugins > div").fadeIn();
          return;
        }
        $(".plugins > div").each(function(i){
          if($(this).find(".ellipsis").text().toLocaleLowerCase().indexOf(val) == -1)
            $(this).stop().fadeOut();
          else
            $(this).stop().fadeIn();
        });
      });
    })();

    $(".categories").length > 0 && (function(){

      $(".search input").on("keyup", function(){
        var val = $(this).val().toLocaleLowerCase().trim();

        if(val == "")
        {
          $(".categories .categorie, .screens, .screens .screen").fadeIn();
          return;
        }
        $(".categories .categorie").each(function(k){
          var count = 0, screens = $(this).next(".screens:first"), elements = screens.find(".screen");
          for(var i in elements)
          {
            var element = elements.eq(i), txt = element.text().trim().toLocaleLowerCase();
            if(txt.indexOf(val) == -1)
            {
              element.fadeOut();
            }
            else
            {
              element.fadeIn();
              count++;
            }
          }

          if(count == 0)
          {
            screens.fadeOut();
            $(this).stop().fadeOut();
          }
          else
          {
            screens.fadeIn();
            $(this).stop().fadeIn();
          }

        });
      });
    })();




  });
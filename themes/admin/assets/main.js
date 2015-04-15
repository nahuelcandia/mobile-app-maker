	$(function(){
		$(document).on("click", ".dropdown.keep-open .dropdown-menu", function(e){
			e.preventDefault();
			e.stopPropagation();
			return false;
		});

		$(document).on("click", ".shovel-group-panel .panel-heading[data-toggle]", function(e){
			$(this).parent(".panel").toggleClass("open");
		});

		/*if($('.select2').length && typeof $('.select2').select2 != "undefined")
		{
			$('.select2').select2();
		}*/

		$(document).on("click", ".up-arrow", function(){
			$("html, body").animate({scrollTop:0});
		});

	});
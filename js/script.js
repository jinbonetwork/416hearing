(function($){
	var g_preScrTop = 0;
	var isMenuOpen = false;

	$(document).ready(function(){
		$('.menu-button').click();

		//menu-button click ////
		$('.menu-button').click(function(){
			$(this).find('.out-se-color').css('color', '');
		});

		//scroll ////
		/*
		$('.page').scroll(function(){
			var scrTop = $(this).scrollTop();
			var direct = (scrTop < g_preScrTop ? 'up' : 'down');
			var $menu = $('.menu-button:not(.menu-button--open)');
			if($menu.css('left') == 'auto'){
				if(direct == 'up') $menu.css('opacity', 1);
				else $menu.css('opacity', 0);
			}
			g_preScrTop = scrTop;
		});

		//fancy box ////
		$(".gallery").fancybox({
			openEffect: 'none',
			closeEffect: 'none'
		});
	});
})(jQuery);

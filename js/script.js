(function($){
	var g_preScrTop = 0;

	$(document).ready(function(){
		$('button.menu-button').trigger('click');
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
	});
})(jQuery);

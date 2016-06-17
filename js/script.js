(function($){
	$(document).ready(function(){
		$('.menu-button').click();

		/*
		$('.pages-nav__item:nth-child(1)').click(function(){
			$('#page-teaser').trigger('scroll');
		});
		*/
		$('.pages-nav__item:nth-child(2)').click(function(){
			$('#page-hearing .open-inner-page').trigger('refresh-scroll-effect-bgcolor');
		});
		$('.pages-nav__item:nth-child(3)').click(function(){
			$('#page-journal').trigger('refresh-scroll-effect-bgcolor');
		});

		//fancy box ////
		$(".gallery").fancybox({
			openEffect: 'none',
			closeEffect: 'none'
		});
	});
})(jQuery);

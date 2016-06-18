(function($){
	$(document).ready(function(){
		$('.menu-button').click();

		$('.pages-nav__item:nth-child(1)').click(function(){
			var intv = setInterval(function(){
				if(!$('#page-2nd-hearing').hasClass('page--inactive')){
					clearInterval(intv);
					$('#page-2nd-hearing .open-inner-page').trigger('refresh-scroll-effect-bgcolor').trigger('refresh-scroll-effect-title');
				}
			}, 100);
		});
		$('.pages-nav__item:nth-child(2)').click(function(){
			var intv = setInterval(function(){
				if(!$('#page-hearing').hasClass('page--inactive')){
					clearInterval(intv);
					$('#page-hearing .open-inner-page').trigger('refresh-scroll-effect-bgcolor').trigger('refresh-scroll-effect-title');
				}
			}, 100);
		});
		$('.pages-nav__item:nth-child(3)').click(function(){
			var intv = setInterval(function(){
				if(!$('#page-journal').hasClass('page--inactive')){
					clearInterval(intv);
					$('#page-journal').trigger('refresh-scroll-effect-bgcolor').trigger('refresh-scroll-effect-title');
				}
			}, 100);

		});

		//fancy box ////
		$(".gallery").fancybox({
			openEffect: 'none',
			closeEffect: 'none'
		});
	});
})(jQuery);

(function($){
	$(document).ready(function(){
		//$('button.menu-button').trigger('click');

		$('.menu-button').click(function(){
			var $activePage = $('.page').not('.page--inactive');
			if($(this).hasClass('menu-button--open')){
				if($activePage.is('#page-journal')){
					$activePage.trigger('deactivate-scroll-effect');
				} else {
					$activePage.find('.open-inner-page').trigger('deactivate-scroll-effect');
					if($activePage.find('.outline.open-inner-page').length) page2ndHearingVideo(false);
				}
			} else {
				var intv = setInterval(function(){
					if(!$('.pages-stack').hasClass('pages-stack--open')){
						clearInterval(intv);
						if($activePage.is('#page-journal')) $activePage.trigger('activate-scroll-effect');
						else $activePage.find('.open-inner-page').trigger('activate-scroll-effect');
					}
				}, 200);
			}
		});
		$('.page').click(function(){
			var $page = $(this);
			if($('.pages-stack').hasClass('pages-stack--open')){
				var intv = setInterval(function(){ if(!$('.pages-stack').hasClass('pages-stack--open')){
					clearInterval(intv);
					if($page.is('#page-journal')) $page.trigger('activate-scroll-effect');
					else $page.find('.open-inner-page').trigger('activate-scroll-effect');
				}}, 200);
			}
		})
		$('.pages-nav__item:nth-child(1)').click(function(){
			var $content = $('#page-2nd-hearing .open-inner-page .content');
			if(!$content.hasClass('applied-resp-grid')) $content.addClass('applied-resp-grid').trigger('refresh-grid');
			var intv = setInterval(function(){
				if(!$('.pages-stack').hasClass('pages-stack--open')){
					clearInterval(intv);
					var $openPage = $('#page-2nd-hearing .open-inner-page');
					if($openPage.hasClass('outline')){
						if($openPage.hasClass('visited') == false){
							$openPage.addClass('visited');
							page2ndHearingVideo(true);
						}
					}
					$openPage.trigger('activate-scroll-effect');
					$openPage.find('.refresh').trigger('refresh');
				}
			}, 200);
		});
		$('.pages-nav__item:nth-child(2)').click(function(){
			var $content = $('#page-hearing .open-inner-page .content');
			if(!$content.hasClass('applied-resp-grid')) $content.addClass('applied-resp-grid').trigger('refresh-grid');
			var intv = setInterval(function(){
				if(!$('.pages-stack').hasClass('pages-stack--open')){
					clearInterval(intv);
					$('#page-hearing .open-inner-page').trigger('activate-scroll-effect');
				}
			}, 200);
		});
		$('.pages-nav__item:nth-child(3)').click(function(){
			var intv = setInterval(function(){
				if(!$('.pages-stack').hasClass('pages-stack--open')){
					clearInterval(intv);
					$('#page-journal').trigger('activate-scroll-effect');
				}
			}, 200);
		});

		//fancy box ////
		$(".gallery").fancybox({ padding: 0 });
	});
	function page2ndHearingVideo(play){
		var $openPage = $('#page-2nd-hearing .outline.open-inner-page');
		var src = $openPage.find('.header .video-wrap').attr('data-src');
		if(play) src += '&autoplay=1';
		$openPage.find('.header iframe').attr('src', src);
	}
})(jQuery);

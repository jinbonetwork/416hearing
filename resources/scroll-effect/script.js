(function($){
	////////
	// 센션의 높이가 화면보다는 크다고 가정한다.

	var g_preScrTop = 0;
	$('.se-container').on('ready', function(){
		$(this).scroll(function(){
			var $contain = $(this);
			var scrTop = $contain.scrollTop();
			var direct = (scrTop < g_preScrTop ? 'up' : 'down');
			var winHeight = $(window).height();
			var $thisSect;
			$contain.find('.se-section').each(function(index){
				var offset = $(this).offset();
				var top = offset.top;
				var bottom = top + $(this).outerHeight(true);
				if(direct == 'down' && 0 < offset.top && offset.top < winHeight/2) {
					$thisSect = $(this);
				} else if(direct == 'up' && winHeight/2 < bottom && bottom < winHeight) {
					$thisSect = $(this);
				} else if(direct == 'up' && index == 0 && top == 0){
					$thisSect = $(this);
				}
				if(top < 0) {
					$contain.find('.se-title.fixed').removeClass('fixed');
					$(this).find('.se-title').addClass('fixed');
				}
			});// each()
			if($.type($thisSect) !== 'undefined'){
				var bgcolor = $thisSect.find('.se-background').css('background-color');
				var color = $thisSect.find('.se-title').css('color');
				$contain.css('background-color', bgcolor);
				$('.se-bgcolor').css('background-color', bgcolor);
				$('.se-color').css('color', color);
			}

			// pre 값들 저장 ////
			g_preScrTop = scrTop;
		});// scroll()
	});
})(jQuery);

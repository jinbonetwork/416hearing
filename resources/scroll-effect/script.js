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

			// 배경색 변환 ////
			var $thisSect;
			$contain.find('.se-section').each(function(index){
				var offset = $(this).offset();
				var top = offset.top;
				var bottom = top + $(this).outerHeight(true);
				if(
					(direct == 'down' && 0 < offset.top && offset.top < winHeight/2) ||
					(direct == 'up' && winHeight/2 < bottom && bottom < winHeight) ||
					(direct == 'up' && index == 0 && top == 0)
				){
					$thisSect = $(this); return false;
				}
			});
			if($.type($thisSect) !== 'undefined'){
				var bgcolor = $thisSect.find('.se-background').css('background-color');
				var color = $thisSect.find('.se-title').css('color');
				$contain.css('background-color', bgcolor);
				$contain.find('.se-bgcolor').css('background-color', bgcolor);
				$contain.find('.se-color').css('color', color);
				$('.out-se-color').css('color', color);
			}

			// 타이틀 고정 ////
			$contain.find('.se-section').each(function(index){
				var offset = $(this).offset();
				var top = offset.top;
				var bottom = top + $(this).outerHeight(true);
				if(top < 0 && bottom > 0) {
					$contain.find('.se-title.fixed').removeClass('fixed');
					$title = $(this).find('.se-title');
					if(!$title.hasClass('bottom')) $title.addClass('fixed');
					if(direct == 'down'){
						if(bottom < $title.outerHeight()) $title.removeClass('fixed').addClass('bottom');
					} else {
						if($title.hasClass('bottom') && bottom > $title.outerHeight()) $title.removeClass('bottom');
					}
					return false;
				}
			});

			// pre 값들 저장 ////
			g_preScrTop = scrTop;
		});// scroll()
	});
})(jQuery);

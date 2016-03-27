(function($){
	////////
	// 센션의 높이가 화면보다는 크다고 가정한다.

	var g_preScrTop = 0;

	$('.se-container').on('refresh', function(){
		initialize($(this));
	});
	$('.se-container').on('ready', function(){
		//initialize ////
		initialize($(this));

		//scroll ////
		$(this).scroll(function(){
			var $contain = $(this);
			var scrTop = $contain.scrollTop();
			var direct = (scrTop < g_preScrTop ? 'up' : 'down');
			var winHeight = $(window).height();

			// 배경색 변환 ////
			var $thisSect;
			$contain.find('.se-section').each(function(index){
				if($(this).hasClass('se-diabled')) return;
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
				$contain.find('.se-bg-bd-t-r').css({'border-top-color': bgcolor, 'border-right-color': bgcolor });
				$contain.find('.se-color').css('color', color);
				$('.out-se-color').css('color', color);
			}

			// 타이틀 고정 ////
			$contain.find('.se-section').each(function(index){
				if($(this).hasClass('se-diabled')) return;
				var offset = $(this).offset();
				var top = offset.top;
				var bottom = top + $(this).outerHeight(true);
				if(top < 0 && bottom > 0) {
					$contain.find('.se-title.fixed').removeClass('fixed');
					$contain.find('.se-title.bottom').removeClass('bottom');
					$title = $(this).find('.se-title');
					if(bottom < $title.outerHeight()) $title.addClass('bottom');
					else $title.addClass('fixed');
					return false;
				}
			});

			// pre 값들 저장 ////
			g_preScrTop = scrTop;
		});// scroll()
	});
	function initialize($container){
		var bgColor = $container.find('.se-background').first().css('background-color');
		var color = $container.find('.se-title').first().css('color');
		$container.css('background-color', bgColor);
		$container.find('.se-bgcolor').css('background-color', bgColor);
		$container.find('.se-bg-bd-t-r').css({'border-top-color': bgColor, 'border-right-color': bgColor});
		$container.find('.se-color').css('color', color);
		$('.out-se-color').css('color', color);
	}
})(jQuery);

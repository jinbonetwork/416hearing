(function($){
	////////
	// 센션의 높이가 화면보다는 크다가 가정한다.

	var g_sectInfo = [];
	var g_preScrTop = 0;

	$ct().on('ready', function(){
		$ct('.se-section').each(function(){
			var offset = $(this).offset();
			g_sectInfo.push({
				top: offset.top,
				bgcolor: $(this).css('background-color'),
				$title: $(this).find('.se-title')
			});
			$(this).css('background-color', 'transparent');
		});
		$ct().css('background-color', g_sectInfo[0].bgcolor);

		$ct().scroll(function(){
			// 배경색 변환 ////
			var scrTop = $(this).scrollTop();
			var direct = (scrTop < g_preScrTop ? 'up' : 'down');
			var scrMd = scrTop + $(window).height() * 0.5;
			var scrBt = scrTop + $(window).height();
			var sect = false;
			if(direct == 'up'){
				for(var i = 1, len = g_sectInfo.length; i < len; i++){
					if(scrMd < g_sectInfo[i].top && g_sectInfo[i].top < scrBt){ sect = i-1; break; }
				}
			} else {
				for(var i = 0, len = g_sectInfo.length; i < len; i++){
					if(scrTop <= g_sectInfo[i].top && g_sectInfo[i].top <= scrMd){ sect = i; break; }
				}
			}
			if(sect !== false) {
				$ct().css('background-color', g_sectInfo[sect].bgcolor);
				g_preSect = sect;
			}
			// 타이틀 고정 ////
			for(var i = 0, len = g_sectInfo.length; i < len-1; i++){
				if(g_sectInfo[i].top <= scrTop && scrTop + $(window).height() <= g_sectInfo[i+1].top){
					g_sectInfo[i].$title.addClass('fixed');
				} else {
					g_sectInfo[i].$title.removeClass('fixed');
				}
			}
			// pre 값들 저장 ////
			g_preScrTop = scrTop;
		});
	});
	function $ct(selector){
		if(selector){
			return $('.se-container').find(selector);
		} else {
			return $('.se-container');
		}
	}
})(jQuery);

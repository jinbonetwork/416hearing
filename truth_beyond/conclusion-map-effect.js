(function($){
	var SewolTruthBeyond = require('./script.js');
	SewolTruthBeyond.prototype.conclusionMapEffect = function(){
		var self = this;
		var $window = $(window);
		var $wrap = self.$el('.conclusion-map');
		var wrapTop, wrapBot, scrTop, preScrTop = 0, direc = 'down';
		var isZooming = false, isAvailable = true, isScrolling = false;

		var $maps = $wrap.find('.map-wrap > img');
		var mapIdx = $maps.length-1;
		$maps.hide();
		$maps.eq(mapIdx).show().css('z-index', 2);
		var text = [
			"이제 더 이상 물러설 수 없습니다!",
			"416특별법 개정안을 통과시키고",
			"특조위 조사기간도 보장되어야 합니다.",
			"특검을 실시하고<br>인양과정을 투명하게 공개할 때",
			"세월호는 온전히 인양되고",
			"미수습자가 가족품에 돌아올 수 있으며",
			"성역 없는 진상 규명이 가능합니다.",
			"감추는 자가 범인입니다!<br>기억하고 함께 행동해주세요."
		];
		$wrap.find('.map-wrap > p').eq(9).remove();
		$wrap.find('.map-wrap > p').eq(8).remove();
		var $text = $wrap.find('.map-wrap > p').each(function(index){
			$(this).css('opacity', 0).html(text[text.length-1-index]);
		});
		self.$el().scroll(function(){
			scrTop = self.$el().scrollTop();
			direc = ( scrTop > preScrTop ? 'down' : 'up' );
			preScrTop = scrTop;
			if(isZooming === false){
				wrapTop = $wrap.offset().top;
				wrapBot = $wrap.offset().top + $wrap.height();
				if(direc == 'down' && wrapTop <= 0 && mapIdx > 0){
					isZooming = true;
					isScrolling = true;
					self.$el().animate({ scrollTop: scrTop + wrapTop }, 'slow', function(){
						isScrolling = false;
					});
				}
				else if(direc == 'up' && wrapBot >= $window.height() && mapIdx < $maps.length-1){
					isZooming = true;
					isScrolling = true;
					self.$el().animate({ scrollTop: scrTop + wrapBot - $window.height() }, 'slow', function(){
						isScrolling = false;
					});
				}
			}
		});
		self.$el().on('mousewheel', function(event){ if(isZooming === true && isScrolling === false){
			event.preventDefault();
			var direc = event.originalEvent.wheelDelta;
			if(isAvailable){
				isAvailable = false;
				if(direc < 0) zoomIn();
				else if(direc > 0) zoomOut();
			}
		}});
		function zoomIn(){
			if(mapIdx <= 0){
				isAvailable = true;
				isZooming = false;
			} else {
				var newWidth = 2*$maps.eq(mapIdx).width();
				var newHeight = 2*$maps.eq(mapIdx).height();
				$maps.eq(mapIdx-1).show().css('z-index', 1);
				$maps.eq(mapIdx).animate({ width: newWidth, height: newHeight }, 'slow', function(){
					$maps.eq(mapIdx).fadeOut('fast', function(){
						mapIdx--; isAvailable = true;
						if(mapIdx > 0) $maps.eq(mapIdx).css('z-index', 2);
						else isZooming = false;
					});
				});
				$text.eq(mapIdx-1).animate({ top: '50%', opacity: 1 }, 'slow');
				$text.eq(mapIdx).animate({ top: 0, opacity: 0 }, 'slow');
			}
		}//zoomIn()
		function zoomOut(){
			if(mapIdx >= $maps.length-1){
				isAvailable = true;
				isZooming = false;
			} else {
				var newWidth = 0.5*$maps.eq(mapIdx+1).width();
				var newHeight = 0.5*$maps.eq(mapIdx+1).height();
				$maps.eq(mapIdx+1).show().css('z-index', 1);
				$maps.eq(mapIdx).fadeOut('fast', function(){
					$maps.eq(mapIdx+1).animate({ width: newWidth, height: newHeight }, 'slow', function(){
						mapIdx++; isAvailable = true;
						if(mapIdx < $maps.length-1) $maps.eq(mapIdx).css('z-index', 2);
						else isZooming = false;
					});
				});
				$text.eq(mapIdx).animate({ top: '100%', opacity: 0 }, 'slow');
				$text.eq(mapIdx+1).animate({ top: '50%', opacity: 1 }, 'slow');
			}
		}//zoomOut()
	}
})(jQuery);

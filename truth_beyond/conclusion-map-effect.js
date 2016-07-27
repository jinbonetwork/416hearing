(function($){
	var SewolTruthBeyond = require('./script.js');
	SewolTruthBeyond.prototype.conclusionMapEffect = function(){
		var self = this;
		var $window = $(window);
		var $wrap = self.$el('.conclusion-map');
		var wrapTop, wrapBot, scrTop, preScrTop = 0, touchY = 0, direc = -1;
		var isZooming = false, isAvailable = true, isScrolling = false, isWheelAvailable = false;
		var duration = 0;

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
		$wrap.find('.map-wrap > p').remove();
		for(var i = text.length-1; i >= 0; i--){
			$('<p>'+text[i]+'</p>').css('opacity', 0).appendTo($wrap.find('.map-wrap'));
		}
		var $text = $wrap.find('.map-wrap > p');

		self.$el().scroll(onScroll);
		self.$el().on('mousewheel', onMousewheel);
		self.$el().on('touchmove', onTouchmove);
		self.$el().on('touchstart', onTouchStart);

		function onScroll(event){
			scrTop = self.$el().scrollTop();
			direc = preScrTop - scrTop;
			preScrTop = scrTop;
			if(isScrolling === false || $.browser.mobile){
				wrapTop = $wrap.offset().top;
				wrapBot = $wrap.offset().top + $wrap.height();
				if(direc < 0 && wrapTop <= 0 && mapIdx > 0){
					autoScroll(scrTop + wrapTop);
				}
				else if(direc > 0 && wrapBot >= $window.height() && mapIdx < $maps.length-1){
					autoScroll(scrTop + wrapBot - $window.height());
				}
			}
		}
		function autoScroll(newScrTop){
			isZooming = true;
			isScrolling = true;
			if($.browser.desktop){
				self.$el().animate({ scrollTop: newScrTop }, duration, function(){
					isScrolling = false;
				});
			} else {
				mobileAutoScroll(newScrTop);
			}
			if(isWheelAvailable === false){
				zoom(direc);
			}
		}
		function mobileAutoScroll(newScrTop){
			var intv = setInterval(function(){
				var diff = self.$el().scrollTop() - newScrTop;
				if(-1 <= diff && diff <= 1){
					clearInterval(intv);
					isScrolling = false;
				} else {
					self.$el().scrollTop(newScrTop);
				}
			}, 50);
		}
		function onMousewheel(event){
			if(!isWheelAvailable){
				isWheelAvailable = true;
				duration = 'fast';
			}
			if(isZooming === true && isScrolling === false){
				event.preventDefault();
				zoom(event.originalEvent.wheelDelta);
			}
		}
		function onTouchmove(event){
			var direction = event.originalEvent.targetTouches[0].pageY - touchY;
			if(!isWheelAvailable){
				isWheelAvailable = true;
				duration = 0;
			}
			if(isZooming === true && isScrolling === false){
				event.preventDefault();
				zoom(direction);
			}
		}
		function onTouchStart(event){
			var e = event.originalEvent;
			touchY = e.targetTouches[0].pageY;
		}
		function zoom(direction){
			if(isAvailable){
				isAvailable = false;
				if(direction < 0) zoomIn();
				else if(direction > 0) zoomOut();
			}
		}
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
					$text.eq(mapIdx).animate({ top: '100%', opacity: 0 }, 'slow');
					$text.eq(mapIdx+1).animate({ top: '50%', opacity: 1 }, 'slow');
				});
			}
		}//zoomOut()
	}
})(jQuery);

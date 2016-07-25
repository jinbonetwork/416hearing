(function($){
	var SewolTruthBeyond = require('./script.js');
	SewolTruthBeyond.prototype.conclusionMapEffect = function(){
		var self = this;
		var $wrap = self.$el('.conclusion-map');
		var wrapTop, wrapBot, scrTop, preScrTop = 0, direc = 'down';
		var startZoom = false, isAvailable = true;
		var $maps = $wrap.find('.map-wrap > img');
		var $text = $wrap.find('.map-wrap > p');
		var mapIdx = $maps.length-1;
		self.$el().scroll(function(){ if(startZoom === false){
			scrTop = self.$el().scrollTop();
			direc = ( scrTop > preScrTop ? 'down' : 'up' );
			preScrTop = scrTop;
			wrapTop = $wrap.offset().top;
			wrapBot = $wrap.offset().top + $wrap.height();
			if(direc == 'down' && mapIdx >= $maps.length-2 && wrapTop <= 0){
				startZoom = true;
				self.$el().scrollTop(scrTop + wrapTop);

			} else if(direc == 'up' && mapIdx <= 1 && wrapBot >= $(window).height()){
				startZoom = true;
				self.$el().scrollTop(scrTop + wrapBot - $(window).height());
			}
		}});
		self.$el().on('mousewheel', function(event){ if(startZoom){
			event.preventDefault();
			var direc = event.originalEvent.wheelDelta;
			if(isAvailable){
				isAvailable = false;
				if(direc < 0 && mapIdx > 0) zoomIn();
				else if(direc > 0 && mapIdx < $maps.length-1) zoomOut();
			}
		}});
		function zoomIn(){
			$maps.hide();
			$maps.eq(mapIdx-1).css('z-index', 1).show();
			$maps.eq(mapIdx).css('z-index', 2).show();
			var newWidth = 2*$maps.eq(mapIdx).width();
			var newHeight = 2*$maps.eq(mapIdx).height();
			$maps.eq(mapIdx).animate({
				width: newWidth,
				height: newHeight
			}, 'slow', function(){
				$maps.eq(mapIdx).fadeOut('fast');
				if(mapIdx > 1){
					isAvailable = true;
					mapIdx--;
				} else {
					isAvailable = true;
					startZoom = false;
				}
			});

			var $p1 = $text.eq(mapIdx).fadeIn('fast');
			var $p2 = $text.eq(mapIdx+1);
			$p1.animate({
				top: '55%'
			}, 'slow');
			if(mapIdx < $maps.length-1){
				$p2.animate({
					top: '-10%'
				}, 'slow', function(){
					$p2.fadeOut('fast');
				});
			}
		}
		function zoomOut(){
			$maps.hide();
			$maps.eq(mapIdx+1).css('z-index', 1).show();
			$maps.eq(mapIdx).css('z-index', 2).show();
			var newWidth = 0.5*$maps.eq(mapIdx+1).width();
			var newHeight = 0.5*$maps.eq(mapIdx+1).height();
			$maps.eq(mapIdx).fadeOut('fast', function(){
				$maps.eq(mapIdx+1).animate({
					width: newWidth,
					height: newHeight
				}, 'slow', function(){
					if(mapIdx < $maps.length-2){
						isAvailable = true;
						mapIdx++;
					} else {
						isAvailable = true;
						startZoom = false;
						$maps.css('z-index', '').css('width', '').css('height', '');
					}
				});
			});

			var $p1 = $text.eq(mapIdx).fadeIn('fast');
			var $p2 = $text.eq(mapIdx-1);
			$p1.animate({
				top: '55%'
			}, 'slow');
			if(mapIdx > 0){
				$p2.animate({
					top: '100%'
				}, 'slow', function(){
					$p2.fadeOut('fast');
				});
			}
		}
	}
})(jQuery);

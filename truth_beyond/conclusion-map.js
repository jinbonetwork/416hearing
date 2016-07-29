(function($){
	var SewolTruthBeyond = require('./script.js');
	SewolTruthBeyond.prototype.conclusionMap = function(partname, partdata, $container){
		var self = this;
		var mkMaps = '';
		for(var i = 4; i <= 12; i++){
			var index = ( i < 10 ? '0'+i : ''+i );
			//mkMaps += '<img data-original="'+self.path.image+'maps/level-'+index+'.jpg" class="lazyload'+(partdata.option == 'auto' ? ' auto' : '')+'">';
			mkMaps += '<img src="'+self.path.image+'maps/level-'+index+'.jpg">';
		}
		var mkText = '';
		if($.browser.desktop) {
			for(var i = partdata.text.length-1; i >= 0; i--) mkText += '<p>'+partdata.text[i]+'</p>';
		} else {
			for(var i = 0; i < partdata.text.length; i++) mkText += '<p>'+partdata.text[i]+'</p>';
			mkText = '<div class="text-wrap">' + mkText + '</div>';
		}
		var markup =
			'<div class="part image-with-title '+partname+'"">' +
				'<div class="image-wrap">' +
					'<div class="map-wrap">' +
						mkMaps + mkText +
					'</div>' +
					'<div class="title-on-image"><h6>'+partdata.title+'</h6></div>' +
				'</div>' +
				( partdata.caption ? '<div class="caption"><h6>'+partdata.caption+'</h6></div>' : '') +
			'</div>';
		var $el = $(markup).appendTo($container);
		if($.browser.mobile){
			$el.find('.title-on-image').addClass('wow fadeInUp');
			$el.find('.text-wrap p').each(function(index){
				var delay = (0.2*(index+1)) + 's'
				$(this).addClass('wow fadeInUp').attr('data-wow-delay', delay);
			});
		}
	}
	SewolTruthBeyond.prototype.conclusionMapEffect = function(){ if($.browser.desktop){
		var self = this;
		var $window = $(window);
		var $wrap = self.$el('.conclusion-map');
		var wrapTop, wrapBot, scrTop, preScrTop = 0, touchY = 0, direc = -1;
		var isZooming = false, isAvailable = true, isScrolling = false, isWheelAvailable = false;
		var duration = 0;
		var $maps = $wrap.find('.map-wrap > img');
		var $text = $wrap.find('.map-wrap > p');
		var txtlidx = $text.length-1;
		var mapIdx = $maps.length-1;

		initialize();
		self.$el().on('scroll', onScroll);
		self.$el().on('mousewheel', onMousewheel);
		//self.$el().on('touchmove', onTouchmove);
		//self.$el().on('touchstart', onTouchStart);

		function initialize(){
			$text.css({
				position: 'absolute',
				top: '100%',
				left: '10%',
				'z-index': 8
			});
			$maps.hide();
			$maps.eq(mapIdx).show().css('z-index', 2);
		}
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
		/*
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
		*/
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
		/*
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
		*/
		function zoom(direction){
			if(isAvailable){
				isAvailable = false;
				if(direction < 0) zoomIn();
				else if(direction > 0) zoomOut();
			}
		}
		function zoomIn(){
			var newWidth, newHeight;
			if(mapIdx <= 0){
				isAvailable = true;
				isZooming = false;
			} else {
				$maps.eq(mapIdx).css('width', '').css('height', '');
				$maps.eq(mapIdx-1).css('width', '').css('height', '');
				newWidth = 2*$maps.eq(mapIdx).width();
				newHeight = 2*$maps.eq(mapIdx).height();
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
			var width, height;
			if(mapIdx >= $maps.length-1){
				isAvailable = true;
				isZooming = false;
			} else {
				$maps.eq(mapIdx+1).css('width', '').css('height', '');
				$maps.eq(mapIdx).css('width', '').css('height', '');
				width = $maps.eq(mapIdx+1).width();
				height = $maps.eq(mapIdx+1).height();
				$maps.eq(mapIdx+1).width(2*width);
				$maps.eq(mapIdx+1).height(2*height);
				$maps.eq(mapIdx+1).show().css('z-index', 1);
				$maps.eq(mapIdx).fadeOut('fast', function(){
					$maps.eq(mapIdx+1).animate({ width: width, height: height }, 'slow', function(){
						mapIdx++; isAvailable = true;
						if(mapIdx < $maps.length-1) $maps.eq(mapIdx).css('z-index', 2);
						else isZooming = false;
					});
					$text.eq(mapIdx).animate({ top: '100%', opacity: 0 }, 'slow');
					$text.eq(mapIdx+1).animate({ top: '50%', opacity: 1 }, 'slow');
				});
			}
		}//zoomOut()
	}}
})(jQuery);

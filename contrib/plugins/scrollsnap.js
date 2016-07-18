(function($){
	$.fn.scrollSnap = function(arg){ if($.browser.desktop){
		if(arg === undefined) arg = { active: { width: 0, height: 0 } };
		if(arg.active === undefined) arg.active = { width: 0, height: 0 };
		var $container = $(this); if($container.length == 0){ console.error('ERROR: .scrollSanp()'); return; }
		var isSnapping = false;
		var isScrollDisable = true;
		var preScrTop = 0;
		var winHeight = $(window).height();
		$(window).resize(function(){ winHeight = $(window).height(); });

		$container.on('mousewheel', function(event){
			snapping(event.originalEvent.wheelDelta);
			if(isScrollDisable) event.preventDefault();
		});
		$(window).keydown(function(event){ if($container.is(':visible')){
			if(event.keyCode === 33 || event.keyCode === 38) snapping(1);
			else if(event.keyCode === 34 || event.keyCode === 40) snapping(-1);
			if(isScrollDisable) event.preventDefault();
		}});
		$container.scroll(function(event){
			var scrTop = $container.scrollTop();
			snapping(preScrTop - scrTop);
			preScrTop = scrTop;
		});
		function snapping(delta){ if($container.is(':visible') && isSnapping === false){
			if(window.innerWidth >= arg.active.width && window.innerHeight >= arg.active.height){
				var scrTop = $container.scrollTop();
				if(arg.region){
					var totHeight = 0;
					$container.find(arg.region).each(function(){ totHeight += $(this).outerHeight(); });
					if(scrTop >= totHeight){
						if(isScrollDisable) isScrollDisable = false;
						return;
					}
					else if(scrTop < totHeight && isScrollDisable === false){
						isScrollDisable = true;
						scrTop = Math.ceil(scrTop / winHeight) * winHeight;
					}
				}
				var newScrTop = ( delta < 0 ? (Math.round(scrTop / winHeight) + 1) * winHeight : (Math.round(scrTop / winHeight) - 1) * winHeight );
				if(newScrTop < 0) return;
				isSnapping = true;
				$container.animate({ scrollTop: newScrTop },{
					duration: 500,
					complete: function(){
						setTimeout(function(){ isSnapping = false; }, 100);
					},
					fail: function(){
						$container.scrollTop(newScrTop);
						setTimeout(function(){ isSnapping = false; }, 100);
					}
				});
			} else {
				isScrollDisable = false;
			}
		}}//snapping()
	}}//$.fn.scrollSnap()
})(jQuery);

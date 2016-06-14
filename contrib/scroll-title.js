(function($){
	$.fn.scrEffectOfTitle = function(arg){
		var selector = this.selector;
		if($(selector).length) scrEffectOfTitle(selector, arg);
		else $(document).ready(function(){ scrEffectOfTitle(selector, arg); });
	}
	function scrEffectOfTitle(selector, arg){
		if(arg === undefined) arg = {};
		if(!arg.title) arg.title = '.title';
		$(selector).css({ 'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch' });
		$(selector).children(arg.section).css({ 'position': 'relative' });
		$(selector).each(function(){
			var $contain = $(this);
			determinActiveWhenResize($contain, arg);
			if(arg.option !== 'wait' && $contain.isActive) fixTitle($contain, arg);
			$contain.on('scroll', function(){ if($contain.isActive){
				fixTitle($contain, arg);
			}});
			$contain.on('scroll', function(){ if($contain.isActive){
				fixTitle($contain, arg);
			}});
			$(window).resize(function(){
				determinActiveWhenResize($contain, arg);
				if($contain.isActive) fixTitle($contain, arg);
			});
			$contain.on('activate-scroll-effect-title', function(){
				$contain.isActive = true;
				setStyle($contain, arg);
				fixTitle($contain, arg);
			});
			$contain.on('deactivate-scroll-effect-title', function(){
				$contain.isActive = false;
				removeStyle($contain, arg);
			});
		});
	}
	function setStyle($contain, arg){
		$contain.children(arg.section).children(arg.title).css('position', 'absolute');
	}
	function removeStyle($contain, arg){
		$contain.children(arg.section).children(arg.title).css({ 'position': '', 'top': '', 'left': '' });
	}
	function determinActiveWhenResize($contain, arg){
		if(arg.active && window.innerWidth < arg.active) {
			$contain.isActive = false;
			removeStyle($contain, arg);
		}
		else {
			$contain.isActive = true;
			setStyle($contain, arg);
		}
	}
	function fixTitle($contain, arg){
		if(arg.before) arg.before($contain);

		var cOfs = $contain.offset();
		var origin = cOfs.top;
		if($contain.is('body')){ origin = $(window).scrollTop(); }
		$contain.children(arg.section).each(function(){
			var $section = $(this);
			var sOfs = $section.offset();
			sOfs.height = $section.outerHeight();
			sOfs.width = $section.outerWidth();
			sOfs.bottom = sOfs.top + sOfs.height;
			var $title = $section.children(arg.title);
			var tLeft = 0;
			if(arg.position === 'right') tLeft = sOfs.width - $title.outerWidth();
			if(sOfs.top <= origin && sOfs.bottom > origin) {
				if(sOfs.bottom - origin < $title.outerHeight()){
					$title.css({
						position: 'absolute',
						top: sOfs.height - $title.outerHeight(),
						left: tLeft
					});
				} else {
					$title.css({
						position: 'fixed',
						top: cOfs.top,
						left: sOfs.left + tLeft
					});
				}
			} else {
				$title.css({
					position: 'absolute',
					top: 0,
					left: tLeft
				});
			}
		});

		if(arg.after) arg.after($contain);
	}
})(jQuery);

(function($){
	$.fn.scrEffectOfBgcolor = function(arg, option){
		var selector = this.selector;
		if($(selector).length) scrEffectOfBgcolor(selector, arg, option);
		else $(document).ready(function(){ scrEffectOfBgcolor(selector, arg, option); });
	}
	function scrEffectOfBgcolor(selector, arg, option){ if(arg){
		if(option === undefined) option = {};
		convArg(arg);
		$(selector).css({ 'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch' });
		$(selector).each(function(){
			var $contain = $(this);
			var sectIndex = -1;
			var active = true;
			changeColor($contain, arg, option, sectIndex);
			$contain.on('scroll', function(){ if(active){
				if(sectIndex < 0) setTransition($contain, arg, option);
				sectIndex = changeColor($contain, arg, option, sectIndex);
			}});
			$(window).resize(function(){ if(active){
				sectIndex = changeColor($contain, arg, option, sectIndex);
			}});
			$contain.on('activate-scroll-effect-bgcolor', function(){ active = true; });
			$contain.on('deactivate-scroll-effect-bgcolor', function(){ active = false; });
		});
	}}
	function convArg(arg){
		arg.background = arg.background.split(' ');
		arg.transition = (arg.transition ? arg.transition + 's' : '1s');
	}
	function setTransition($contain, arg, option){
		$contain.css({'transition': 'background-color '+arg.transition });
		if(option.element){
			if(option.element.background) $contain.find(option.element.background).css({'transition': 'background-color '+arg.transition});
			if(option.element.text) $contain.find(option.element.text).css({'transition': 'color '+arg.transition});
			if(option.element.border) $contain.find(option.element.border).css({'transition': 'border-color '+arg.transition });
		}
		if(option.beyond){
			if(option.beyond.background) $contain.find(option.beyond.background).css({'transition': 'background-color '+arg.transition});
			if(option.beyond.text) $contain.find(option.beyond.text).css({'transition': 'color '+arg.transition});
			if(option.beyond.border) $contain.find(option.beyond.border).css({'transition': 'border-color '+arg.transition });
		}
	}
	function changeColor($contain, arg, option, oldIndex){
		var $contain, conHeight, origin;
		if(!$contain.is('body')){
			conHeight = $contain.outerHeight();
			origin = $contain.offset().top;
		}
		else {
			conHeight = $(window).outerHeight();
			origin = $(window).scrollTop();
		}
		var curIndex = oldIndex;
		$contain.children(option.child).each(function(index){
			var top = $(this).offset().top - origin;
			var bottom = top + $(this).outerHeight(true);
			if(bottom / conHeight > 0.5 || top / conHeight >= 0.5){
				curIndex = index;
				return false;
			} else if(top === 0){
				curIndex = 0; return false;
			}
		});
		if(oldIndex !== curIndex){
			if(option.before) option.before($contain);

			$contain.css({ 'background-color': arg.background[curIndex] });
			if(option.element){
				$contain.find(option.element.background).css({ 'background-color': arg.background[curIndex] });
				$contain.find(option.element.text).css({ 'color': arg.background[curIndex] });
				$contain.find(option.element.border).css({ 'border-color': arg.background[curIndex] });
			}
			if(option.beyond){
				$(option.beyond.background).css({ 'background-color': arg.background[curIndex] });
				$(option.beyond.text).css({ 'color': arg.background[curIndex] });
				$(option.beyond.border).css({ 'border-color': arg.background[curIndex] });
			}

			if(option.after) option.after($contain);
		}
		return curIndex;
	}
})(jQuery);

(function($){
	$.fn.scrEffectOfBgcolor = function(arg){
		var selector = this.selector;
		if($(selector).length) scrEffectOfBgcolor(selector, arg);
		else $(document).ready(function(){ scrEffectOfBgcolor(selector, arg); });
	}
	function scrEffectOfBgcolor(selector, arg){ if(arg){
		convArg(arg);
		$(selector).css({ 'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch' });
		$(selector).each(function(){
			var contain = new Container($(this), arg.section);
			contain.changeColorFirst(arg);
			contain.$wrapper.on('scroll', function(){
				var scrtop = contain.$self.scrollTop();
				//if(scrtop > contain.scrtop) contain.scrdir = 1;
				//else if(scrtop < contain.scrtop) contain.scrdir = -1;
				//else contain.scrdir = 0;
				contain.scrdir = scrtop - contain.scrtop;
				contain.scrtop = scrtop;
				if(contain.active) contain.changeColor(arg);
			});
			$(window).resize(function(){ if(contain.active){ contain.changeColor(arg, 'force'); }});
			contain.$self.on('refresh-scroll-effect', function(){ if(contain.active){ contain.changeColor(arg, 'force'); } });
			contain.$self.on('activate-scroll-effect', function(){
				contain.active = true;
				contain.changeColor(arg, 'force');
			});
			contain.$self.on('deactivate-scroll-effect', function(){
				contain.active = false;
			});
		});
	}}
	function Container($contain, section){
		this.$self = $contain;
		this.sects = $contain.children(section);
		this.index = 0;
		this.active = true;
		this.scrtop = 0;
		this.scrdir = 0;
		if(!$contain.is('body')){
			this.$wrapper = $contain;
			this.getOrigin = this.offsetTop;
		} else {
			this.$wrapper = $(window);
			this.getOrigin = this.scrollTop;
		}
	}
	Container.prototype.offsetTop = function(){
		return this.$wrapper.offset().top;
	}
	Container.prototype.scrollTop = function(){
		return this.$wrapper.scrollTop();
	}
	Container.prototype.changeColor = function(arg, force){ if(this.$self.is(':visible')){
		var contain = this;
		var origin = contain.getOrigin(), wrapHeight = contain.$wrapper.outerHeight();
		var index = contain.index;
		if(contain.scrdir > 0 && index < contain.sects.length - 1){
			var i = index + 1;
			var $sect = $(contain.sects[i]);
			var top = $sect.offset().top - origin;
			var bottom = top + $sect.outerHeight(true);
			if(top <= 0.5*wrapHeight || (i == contain.sects.length - 1 && Math.round(bottom) == Math.round(wrapHeight))) index++;
		} else if(contain.scrdir < 0 && index > 0){
			var i = index - 1;
			var $sect = $(contain.sects[i]);
			var top = $sect.offset().top - origin;
			var bottom = top + $sect.outerHeight(true);
			if(bottom >= 0.5*wrapHeight || (i == 0 && top == 0)) index--;
		}
		if(contain.index !== index || force){
			if(arg.before) arg.before(contain.$self, arg.background[contain.index], contain.index);
			contain.index = index;
			contain.$self.stop().animate({'background-color': arg.background[index]}, arg.transition);
			if(arg.after) arg.after(contain.$self, arg.background[index], index);
		}
	}}
	Container.prototype.changeColorFirst = function(arg){
		this.$self.css({'background-color': arg.background[0]});
		if(arg.after) arg.after(this.$self, arg.background[0], 0);
	}
	function convArg(arg){
		arg.background = arg.background.split(' ');
		arg.transition = (arg.transition ? arg.transition * 1000 : 1000);
	}
})(jQuery);

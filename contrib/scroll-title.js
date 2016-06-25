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
			var contain = new Container($(this), arg);
			contain.determinActive(arg);
			if(arg.option !== 'wait' && contain.active && contain.widthActive) contain.fixTitle(arg, 'all');
			contain.$wrapper.on('scroll', function(){
				var scrtop = contain.$self.scrollTop();
				if(scrtop > contain.scrtop) contain.scrdir = 1; else contain.scrdir = -1;
				contain.scrtop = scrtop;
				if(contain.active && contain.widthActive) contain.fixTitle(arg);
			});
			$(window).resize(function(){
				contain.determinActive(arg);
				if(contain.active && contain.widthActive) contain.fixTitle(arg, 'all');
			});
			contain.$self.on('refresh-scroll-effect', function(){ if(contain.active && contain.widthActive){
				contain.fixTitle(arg, 'all');
			}});
			contain.$self.on('activate-scroll-effect', function(){ if(contain.active === false){
				contain.active = true;
				if(contain.widthActive){
					contain.setStyle(arg);
					contain.fixTitle(arg, 'all');
				}
			}});
			contain.$self.on('deactivate-scroll-effect', function(){ if(contain.active === true){
				contain.active = false;
				contain.removeStyle(arg);
			}});
		});
	}
	function Container($contain, arg){
		this.$self = $contain;
		this.sects = $contain.children(arg.section);
		this.index = 0;
		this.active = true;
		this.widthActive = true;
		this.scrtop = 0;
		this.scrdir = 1;
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
	Container.prototype.determinActive = function(arg){ if(arg.active){
		if(window.innerWidth < arg.active){
			if(this.widthActive){
				this.removeStyle(arg); this.widthActive = false;
			}
		} else {
			if(!this.widthActive){
				this.setStyle(arg);
				this.widthActive = true;
			}
		}
	}}
	Container.prototype.setStyle = function(arg){
		this.sects.children(arg.title).css('position', 'absolute');
	}
	Container.prototype.removeStyle = function(arg){
		this.sects.children(arg.title).css({ position: '', top: '', bottom: '', left: '', right: '' });
	}
	Container.prototype.fixTitle = function(arg, all){ if(this.$self.is(':visible')){
		var origin = this.getOrigin();
		var $section, $title, tLeft, sectWidth, where;
		var start, min, max, increment;

		if(all !== 'all'){
			start = this.index;
			min = (this.index > 0 ? this.index - 1 : 0);
			max = (this.index < this.sects.length - 1 ? this.index + 1 : this.sects.length - 1);
			increment = this.scrdir;
		} else {
			start = 0; min = 0; max = this.sects.length-1; increment = 1;
		}

		if(arg.before) arg.before(this.$self);
		for(var i = start; min <= i && i <= max; i += increment){
			$section = $(this.sects[i]);
			$title = $section.children(arg.title);
			sectWidth = $section.outerWidth();
			tLeft = (arg.position === 'right' ? sectWidth - $title.outerWidth() : 0);
			where = this.whereIsTheSection($section, $title, origin);
			if(where === 'above'){
				$title.css({
					position: 'absolute',
					top: $section.outerHeight() - $title.outerHeight(),
					left: tLeft,
					right: 'auto'
				});
			} else if(where === 'here'){
				this.index = i;
				$title.css({
					position: 'fixed',
					top: this.$self.offset().top,
					left: $section.offset().left + tLeft,
					right: 'auto'
				});
			} else if(where === 'outside'){
				$title.css({
					position: 'absolute',
					top: 0,
					left: tLeft,
					right: 'auto'
				});
			}
		}
		if(arg.after) arg.after(this.$self);
	}}
	Container.prototype.whereIsTheSection = function($section, $title, origin){
		var sOfs = $section.offset();
		sOfs.bottom = sOfs.top + $section.outerHeight();
		if(sOfs.top <= origin && sOfs.bottom > origin) {
			if(sOfs.bottom - origin < $title.outerHeight()) return 'above';
			else return 'here';
		} else return 'outside';
	}
})(jQuery);

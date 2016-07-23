(function($){
	$.fn.fitEnd = function($target, which, active){
		return this.each(function(){
			new FitEnd($(this), $target, which, active);
		});
	}
	function FitEnd($el, $target, which, active){
		this.$el = $el;
		this.$target = $target;
		this.which = which;
		this.active = active;
		this.prop = '';

		this.init();
		this.fitEnd();
		this.events();
	}
	FitEnd.prototype.init = function(){
		switch(this.which){
			case 'top': this.prop = 'padding-bottom'; break;
			case 'bottom': this.prop = 'padding-top'; break;
			case 'left': this.prop = 'padding-right'; break;
			case 'right': this.prop = 'padding-left'; break;
		}
	}
	FitEnd.prototype.fitEnd = function(){
		this.$el.css(this.prop, '');
		if(this.$el.is(':visible') && this.active <= window.innerWidth){
			var self = this;
			var oEnd1 = self.$el[0].getBoundingClientRect()[self.which];
			var oEnd2 = self.$target[0].getBoundingClientRect()[self.which];
			var end1, end2;
			var intv = setInterval(function(){
				end1 = self.$el[0].getBoundingClientRect()[self.which];
				end2 = self.$target[0].getBoundingClientRect()[self.which];
				if(oEnd1 === end1 && oEnd2 === end2){
					clearInterval(intv);
					self.$el.css(self.prop, '+='+(end2 - end1));
				} else {
					oEnd2 = end2;
					oEnd1 = end1;
				}
			}, 200);
		}
	}
	FitEnd.prototype.events = function(){
		this.$el.on('refresh', this.fitEnd.bind(this));
		$(window).resize(this.fitEnd.bind(this));
	}
})(jQuery);

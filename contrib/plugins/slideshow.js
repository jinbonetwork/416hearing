(function($){
	$.fn.slideshow = function(arg){
		(function(){
			var defaults = {
				section: 'li',
				ratio: 3/4,
				gutter: '5%',
				bgcolor: '#4d4d4d',
				captbgcolor: '#4d4d4d'
			}
			arg = $.extend({}, defaults, arg);
		})();
		$(this).each(function(){
			new Slideshow($(this), arg);
		});
	}//$.fn.slideshow
	function Slideshow($contain, arg){
		this.arg = arg;
		this.containRatio = this.arg.ratio;
		this.index = 0;
		this.$contain = $contain;
		this.$sections = $contain.children(this.arg.section);
		this.$mainWrap, this.$leftWrap, this.$rightWrap;

		this.initMarkup();
		this.initialize();
		this.fitImages();
		this.makeCaption();
		this.makeArrowAndClickEvent();
		this.bindRefreshEvent();
	}
	Slideshow.prototype.initMarkup = function(){
		this.$mainWrap = $('<div class="slideshow-wrap"></div>').appendTo(this.$contain).append(this.$sections);
		this.$leftWrap = $('<div class="left"><div class="prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></div></div>').insertBefore(this.$mainWrap);
		this.$rightWrap = $('<div class="right"><div class="next"><i class="fa fa-chevron-right" aria-hidden="true"></i></div></div').insertAfter(this.$mainWrap);
	}
	Slideshow.prototype.initialize = function(){
		this.$contain.css({ height: this.$contain.width() * this.containRatio, overflow: 'hidden', position: 'relative' });
		this.$leftWrap.css({ width: this.arg.gutter, height: '100%', float: 'left' });
		this.$rightWrap.css({ width: this.arg.gutter, height: '100%', float: 'left' });
		var mainWidth = this.$contain.width() - this.$leftWrap.width() - this.$rightWrap.width() - 1;
		this.$mainWrap.css({ position: 'relative', width: mainWidth, height: '100%', float: 'left' });
		this.$sections.css({ position: 'absolute', top: 0, left: 0, diasplay: 'block',
			width: '100%', height: '100%', overflow: 'hidden', 'background-color': this.arg.bgcolor
		});
		this.$sections.children('a').css({ diasplay: 'block', width: '100%', height: '100%', overflow: 'hidden' });
	}
	Slideshow.prototype.fitImages = function(){
		var self = this;
		var maxImgHeight = 0;
		var numOfLoad = 0;
		self.$sections.find('img').load(function(){
			var $img = $(this);
			var ratio = $img.height() / $img.width();
			if(ratio > self.containRatio) $img.css('height', '100%');
			else $img.css('width', '100%');
			if(maxImgHeight < $img.height()) maxImgHeight = $img.height();
			numOfLoad++;
			if(numOfLoad == self.$sections.length){
				self.$contain.height(maxImgHeight);
				self.containRatio = maxImgHeight / self.$contain.width();
				self.adjustImageMarginAndPlayIcon();
			}
		});
	}
	Slideshow.prototype.adjustImageMarginAndPlayIcon = function(){
		this.$sections.find('img').each(function(){
			var $img = $(this);
			$img.css({ 'margin-top': '', 'margin-bottom': '', 'margin-left': '', 'margin-right': '' });
			if($img.width() == $img.parent().width()){
				var margin = ($img.parent().height() - $img.height())/2;
				$img.css({ 'margin-top': margin, 'margin-bottom': margin });
			} else {
				var margin = ($img.parent().width() - $img.width())/2;
				$img.css({ 'margin-left': margin, 'margin-right': margin });
			}
		});
		this.$sections.find('.play-icon').each(function(){
			$(this).children('i').css({ 'font-size': $(this).height() });
		});
	}
	Slideshow.prototype.makeCaption = function(){
		var self = this;
		self.$sections.find('img').each(function(){ if($(this).attr('alt')){
			var $caption = $('<div class="caption"><span>'+$(this).attr('alt')+'</span></div>').insertAfter($(this));
			$caption.css({
				position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'auto', opacity: 0.7, 'background-color': self.arg.captbgcolor,
				padding: '0.5em 1em'
			});
		}});
	}
	Slideshow.prototype.makeArrowAndClickEvent = function(){ if(this.$sections.length > 1){
		var self = this;
		var $prev = self.$leftWrap.children('.prev'), $next = self.$rightWrap.children('.next');
		$prev.css({ position: 'absolute', 'z-index': '10', height: '10%', width: 'auto', top: '45%', left: 0, cursor: 'pointer' });
		$next.css({ position: 'absolute', 'z-index': '10', height: '10%', width: 'auto', top: '45%', right: 0, cursor: 'pointer' });
		$prev.children().css({ 'font-size': $prev.height() });
		$next.children().css({ 'font-size': $next.height() });

		var isChanging = false;
		self.$sections.not(':eq(0)').css({ left: self.$contain.width() });
		$next.click(function(){ if(isChanging === false){
			isChanging = true;
			var next = ( self.index < self.$sections.length-1 ? self.index+1 : 0 );
			self.$sections.eq(self.index).finish().animate({ left: -1*self.$contain.width() }, 1000, 'easeOutQuint');
			self.$sections.eq(next).css({ left: self.$contain.width() }).finish().animate({ left: 0 }, 1000, 'easeOutQuint', function(){ isChanging = false; });
			self.index = next;
		}});
		$prev.click(function(){if(isChanging === false){
			isChanging = true;
			var prev = ( self.index > 0 ? self.index-1 : self.$sections.length-1 );
			self.$sections.eq(self.index).finish().animate({ left: self.$contain.width() }, 1000, 'easeOutQuint');
			self.$sections.eq(prev).css({ left: -1*self.$contain.width() }).finish().animate({ left: 0 }, 1000, 'easeOutQuint', function(){ isChanging = false; });
			self.index = prev;
		}});
	}}
	Slideshow.prototype.bindRefreshEvent = function(){
		this.$contain.on('refresh', this.refresh.bind(this));
		$(window).resize(this.refresh.bind(this));
	}
	Slideshow.prototype.refresh = function(){ if(this.$contain.is(':visible')){
		this.$contain.css({ height: this.$contain.width()*this.containRatio });
		this.$mainWrap.css({ width: this.$contain.width() - this.$leftWrap.width() - this.$rightWrap.width() - 1 });
		this.adjustImageMarginAndPlayIcon();
		this.$sections.not(':eq('+this.index+')').css({ left: this.$contain.width() });
	}}
})(jQuery);

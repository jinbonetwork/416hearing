(function($){
	$.fn.clickAndPlayYoutube = function($scrollContainer){
		// Dependency:
		//  - font-awesome
		//  - extraStyle
		//  - youtube api
		//  - jquery-browser-plugin

		var self = this;
		if($.type(YT.Player) === 'function') begin();
		else {
			var intv = setInterval(function(){
				if($.type(YT.Player) === 'function'){
					clearInterval(intv);
					begin();
				}
			}, 100);
		}
		function begin(){
			self.each(function(){
				new ClickAndPlayYoutube($(this), $scrollContainer);
			});
		}

		return self;
	}
	function ClickAndPlayYoutube($player, $scrollContainer){
		var self = this;
		self.$player = $player;
		self.$container = ( $scrollContainer ? $scrollContainer : $(window) );
		self.player = undefined;
		self.id = $player.attr('data-youtube-id');
		self.playerid = 'player-'+self.id;
		self.$playIcon, self.$ffImage;

		self.loadFirstFrameImage();
		self.clickAndPlay();
		if($.browser.mobile){
			self.loadVideoInWindow();
		}

		self.bindRefresh();
	}
	ClickAndPlayYoutube.prototype.loadFirstFrameImage = function(){
		var self = this;
		// Markup ////
		self.$playIcon = $('<div class="play-icon"><i class="fa fa-play"></i></div>').appendTo(self.$player);
		self.$ffImage = $('<img src="http://img.youtube.com/vi/'+self.id+'/0.jpg">').appendTo(self.$player);
		// Sytle ////
		self.$player.css({ position: 'relative' });
		self.$playIcon.css({ position: 'absolute', left: '40%', top: '40%', width: '20%', height: '20%', cursor: 'pointer', 'text-align': 'center' });
		self.$playIcon.children('i').css({ 'font-size': self.$playIcon.height(), color: '#6d92c4', opacity: 0.8 });
		self.$ffImage.css({ cursor: 'pointer' }).extraStyle({ fitted: 'yes' });
	}
	ClickAndPlayYoutube.prototype.clickAndPlay = function(){
		var self = this;
		self.$playIcon.click(function(){ self.loadVideo('autoplay'); });
		self.$ffImage.click(function(){ self.loadVideo('autoplay'); });
	}
	ClickAndPlayYoutube.prototype.loadVideoInWindow = function(){
		var self = this;
		load();
		self.$container.scroll(load);
		function load(){
			var top = self.$player.offset().top;
			if(self.$player.is(':visible') && top < $(window).height()){
				self.loadVideo();
			}
		}
	}
	ClickAndPlayYoutube.prototype.loadVideo = function(autoplay){
		var self = this;
		self.$player.append('<div id="'+self.playerid+'"></div>');
		self.player = new YT.Player(self.playerid, {
			width: '100%',
			height: '100%',
			videoId: self.id,
			events: {
				onReady: function(){
					self.$playIcon.hide();
					self.$ffImage.hide();
					self.$player.data('ytplayer', self.player);
					if(autoplay) self.player.playVideo();
				}
			}
		});
	}
	ClickAndPlayYoutube.prototype.bindRefresh = function(){
		var self = this;
		self.$player.on('refresh', self.refresh.bind(self));
		$(window).resize(self.refresh.bind(self));
	}
	ClickAndPlayYoutube.prototype.refresh = function(){
		var self = this;
		if(self.$playIcon.is(':visible')){
			self.$playIcon.children('i').css({ 'font-size': self.$playIcon.height() });
		}
	}
})(jQuery);

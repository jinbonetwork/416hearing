(function($){
	$.fn.clickAndPlayYoutube = function($scrollContainer, isActive){
		// Dependency:
		//  - font-awesome
		//  - extraStyle
		//  - youtube api
		//  - jquery-browser-plugin

		return this.each(function(){
			new ClickAndPlayYoutube($(this), $scrollContainer, isActive);
		});
	}
	function ClickAndPlayYoutube($player, $scrollContainer, isActive){
		var self = this;
		self.$player = $player;
		self.$container = ( $scrollContainer ? $scrollContainer : $(window) );
		self.player = undefined;
		self.id = $player.attr('data-youtube-id');
		self.playerid = 'player-'+self.id;
		self.$playIcon, self.$ffImage;
		self.active = ( isActive === undefined || isActive ? true : false );

		self.$player.on('activate', function(){ self.active = true; });

		if($.type(YT.Player) === 'function') self.ready();
		else {
 			var intv = setInterval(function(){
				if($.type(YT.Player) === 'function'){
					clearInterval(intv);
					self.ready();
				}
			}, 100);
		}

	}
	ClickAndPlayYoutube.prototype.ready = function(){
		var self = this;
		self.loadFirstFrameImage();
		self.clickAndPlay();
		if($.browser.mobile){
			self.loadVedioInMobile();
			self.$container.scroll(self.loadVedioInMobile.bind(self));
			self.$player.on('activate', function(){ self.active = true; self.loadVedioInMobile(); });
			self.$player.on('deactivate', function(){ self.active = false; });
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
	ClickAndPlayYoutube.prototype.loadVedioInMobile = function(){
		var self = this;
		if(self.active){
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

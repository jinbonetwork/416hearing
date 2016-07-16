var _ = require('../contrib/underscore/underscore-min.js');
var sHearing2;

(function($){

	//'use strict';

	function SewolHearing2(element,options) {
		this.Root = $( element );

		this.settings = $.extend({}, $.fn.sewolhearing2.defaults, options);

		this.g_path = {
			root: 'data/2nd_hearing/',
			image: 'data/2nd_hearing/images/',
			doc: 'data/2nd_hearing/docs/',
			audio: 'data/2nd_hearing/audio/',
			video: ''
		}

		this.parts = undefined;
		this.suspicions = undefined;
		this.witnesses = undefined;
		this.partMap = [0, 0, 0, 1, 1, 1];

		this.controller = this.parseUrlHash();

		this.init();
	}

	SewolHearing2.prototype = {
		init: function() {
			var self = this;

			var params = { data: '2nd_hearing' };
			$.ajax({
				url: './api.php',
				data: params,
				dataType: 'json',
				method: 'GET',
				success: function(json){
					self.suspicions = json.suspicions;
					self.parts = json.parts;
					self.witnesses = json.witnesses;
					self.initMarkup();
				},
				complete: function(){
					self.initEvent();
				}
			});
		},

		initMarkup: function() {
			var self = this;

			if(this.parts && this.suspicions && this.witnesses) {
				this.Root.find('.outline .content').append(self.htmlOutline());
			}
			for(var i = 1, leni = this.partMap.length; i <= leni; i++){
				this.Root.find('.sections').append('<section id="suspicion-'+i+'" class="inner-page"></section>');
			}
		},

		initEvent: function() {
			var self = this;
			//첫 페이지 비디오 ////
			this.Root.find('.outline .video-wrap').addClass('refreshable').extraStyle({
				ratio: (360/640)
			});
			// 첫 페이지 반응형 처리////
			var outlineBreakPoint = '320 1024';
			this.Root.find('.outline > .header .title-part-1 span').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1 2 em max'
			});
			this.Root.find('.outline > .header .title-part-2 span').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '3 6 em max'
			});
			this.Root.find('.outline > .header .title-part-3 span').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1.2 2.4 em max'
			});
			this.Root.find('.outline > .header').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'padding-top': '3 5 em max',
				'padding-bottom': '3 5 em max'
			});
			this.Root.find('.outline > .header .video-wrap').respStyle({
				'breakpoint': outlineBreakPoint,
				'margin-bottom': '3 7 em max'
			});
			this.Root.find('.outline .content').addClass('refreshable').respGrid({
				breakpoint: '320 768',
				columns: '1 2',
				ratio: 'auto',
				gutter: '0 ='
			});
			$(window).trigger('es-setScrollbarEvent');

			// 첫 페이지의 기울어진 경계선을 위한 ////
			this.Root.find('.outline .content .part:eq(0) .tilted-border-line').addClass('refreshable').tiltBorderLine();

			// 첫 페이지 의혹 제목의 hover 효과를 위한 ////
			this.Root.find('.outline .content .item .hover-text-wrap').addClass('refreshable').sameSizeWithParent('.item-wrap');

			//첫 페이지 스크롤 효과 ////
			this.Root.find('.outline').scrEffectOfBgcolor({
				background: '#ffffff #1a1a1a',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#1a1a1a', '#ffffff'];
					$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					if(bgcIndex === 0){
						self.Root.find('.outline .content').find('.item-wrap > span, .title > span').css('color', '#6e6e6e');
						self.Root.find('.outline .content .tilted-border-line').stop().animate({'border-color': '#6e6e6e'}, 1000);
					} else {
						self.Root.find('.outline .content').find('.item-wrap > span, .title > span').css('color', '');
						self.Root.find('.outline .content .tilted-border-line').stop().animate({'border-color': ''}, 1000);
					}
				}
			});

			// 팬시 박스 설정 ////
			this.Root.find(".gallery").fancybox({ padding: 0 });

			// 의혹 페이지로 이동 ////
			this.Root.find('.outline li').click(function() {
				self.movePage(0, $(this).attr('data-num'));
			});

			// ////
			if(this.controller.section) {
				this.movePage(0, this.controller.section);
			}
		},

		appendSection: function(index){
			var self = this;
			var $susp = self.Root.find('#suspicion-'+index);
			$susp.addClass('visited-page').append( self.makeHtml(index-1, self.suspicions[index-1]) );
			// 데이터가 없는 요소를 숨기거나 삭제 ////
			$susp.find('.etc').each(function(){
				if($(this).find('.links.num-0').length)
					$(this).hide();
			});
			$susp.find('.witness-photo').each(function() {
				if( !$(this).attr('data-name') )
					$(this).closest('.answer').hide();
			});
			// 첫 페이지로 이동 ////
			$susp.find('.go-back-outline').click(function() {
				var num = $(this).parents('section').attr('id').replace(/suspicion\-/, '');
				self.movePage(num, 0);
			});
			//증인 정보 표시 ////
			$susp.find('.witness-photo').sewolwitnesses({
				component: self
			});
			// 반응형 처리 ////
			$susp.find('.abstract .list p').addClass('refreshable').respStyle({
				breakpoint: '1024 1680',
				'padding-top': '0 72 max',
				'padding-left': '15 72 max'
			});
			// 스크롤 효과 ////
			$susp.scrEffectOfBgcolor({
				background: '#1a1a1a #ffffff',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#ffffff', '#1a1a1a'];
					$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
				}
			});
			// '주요 내용'의 이미지를 슬라이드로 ////
			$susp.find('.abstract-media').addClass('refreshable').slideshow({
				ratio: 35/43,
				gutter: '0'
			});
			$susp.find('.audio-gallery').fancybox({
				padding: 0,
				afterLoad: function(current, previous){
					var audioUrl = $susp.find('.audio-gallery').eq(current.index).find('img').attr('data-audio-url');
					$(current.inner).append('<audio controls><source src="'+audioUrl+'" type="audio/mpeg"></audio>');
				}
			});
			// 스크롤 스냅 ////
			$susp.find('.suspicion-header, .content .abstract ul.list > li').addClass('refreshable').paddingHeightAuto({
				active: { width: 1024, height: 700 }
			});
			$susp.scrollSnap({
				region: '.suspicion-header, .content .abstract ul.list > li',
				active: { width: 1024, height: 700 }
			});
			// 증인 이미지를 회색톤으로 ////
			$susp.find('.witness-photo > .photo-wrap img').addClass('grayscale').gray();
			// 슬라이드의 이미지가 아닌 그 밖의 이미지를 회색톤 & hover effect & 크롭 ////
			$susp.find('.medium img').addClass('refreshable').extraStyle({ fitted: 'yes' });
			//$susp.find('.medium img').addClass('grayscale grayscale-fade').gray();
			// '의혹 전체보기' ////
			this.eventsOfGoBackOutline($susp);
		},

		eventsOfGoBackOutline: function($susp){
			var $gbo = $susp.find('.go-back-outline');
			$(window).resize(function(){ if($susp.is(':visible')){
				$gbo.css('position', '');
			}});
			$susp.on('activate', function(){
				if($gbo.css('position') == 'absolute') $gbo.css('position', 'fixed');
			}).on('deactivate', function(){
				if($gbo.css('position') == 'fixed') $gbo.css('position', 'absolute');
			});
		},

		movePage: function(nFrom, nTo){
			var $from = ( nFrom == 0 ? this.Root.find('.outline') : this.Root.find('#suspicion-'+nFrom) );
			var $to = ( nTo == 0 ? this.Root.find('.outline') : this.Root.find('#suspicion-'+nTo) );

			//이전 페이지 닫기 ///
			if(nFrom == 0){
				// 첫 페이지 비디오 재생 중지 ////
				$from.find('#hearing2-video').get(0).contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
			}
			$from.removeClass('open-inner-page');
			$from.trigger('deactivate');

			// 현재 페이지 열기 ////
			$to.addClass('open-inner-page');
			if($to.hasClass('visited-page')){
				$to.find('.refreshable').trigger('refresh');
				$to.trigger('activate');
				$to.scrollTop(0);
			} else {
				this.appendSection(nTo);
			}
		},//movePage

		htmlOutline: function() {
			var self = this;
			var template = _.template(self.Root.find('#outline-template').html());
			var tplSuspicions = _.template(self.Root.find('#outline-suspicion-template').html());
			var html = '';
			for(var i = 0, leni = this.parts.length; i < leni; i++) {
				var susp = '';
				for(var j = 0, lenj = this.partMap.length; j < lenj; j++) {
					if(this.partMap[j] == i) susp += tplSuspicions({ num: j+1, item: self.suspicions[j].title });
				}
				html += template({
					partNum: i + 1,
					title: self.parts[i].title,
					supicions: susp
				});
			}
			return html;
		},

		makeHtml: function(sectNum, section){
			var self = this;
			var tplSection = _.template(self.Root.find('#section-template').html());
			if(_.isEmpty(section)) return;
			return tplSection({
				section: sectNum + 1,
				partNum: self.partMap[sectNum] + 1,
				partMainTitle: self.parts[self.partMap[sectNum]].title,
				titleNum: sectNum + 1,
				title: section.title,
				bgMediaSize: self.mediaSize(section.background.media),
				bgMedia: self.htmlMedia(section.background.media, 'hr2'+sectNum+'bg'),
				background: section.background.content,
				witness: self.htmlWitnesses(section.witnesses, self.witnesses),
				abstract: self.htmlAbstract(section.abstract, 'hr2'+sectNum+'ab'),
				dialogue: self.htmlDialogue(section.dialogue, self.witnesses, 'hr2'+sectNum+'da'),
				etcMediaSize: self.mediaSize(section.etc.media),
				etcMedia: self.htmlMedia(section.etc.media, 'hr2'+sectNum+'etc'),
				etcLinkNum: section.etc.content.length,
				etcLinks: self.htmlEtc(section.etc.content)
			});
		},

		mediaSize: function(media){
			if(media.length == 0) return '0';
			else return media.length + (media[0].size == 's=b' ? '-big' : '-small');
		},

		htmlAbstract: function(abstract, gallery){
			var self = this;

			var html = '';
			var template = _.template(this.Root.find('#abstract-template').html());
			for(var i = 0, len = abstract.length; i < len; i++){
				var abs = abstract[i];
				html += template({
					abstractMedia: (abs.media.length ? self.htmlAbsMedia(abs.media, gallery+'p'+i) : ''),
					abstract: abs.content
				});
			}
			return html;
		},

		htmlDialogue: function(dialogue, witData, gallery){
			var html = '';
			var template = _.template(this.Root.find('#dialogue-template').html());
			var qa_template = _.template(this.Root.find('#dialogue-qa-template').html());
			var dlgVideoTmpl = _.template(this.Root.find('#dialogue-video-tempate').html());
				for(var i = 0, len = dialogue.length; i < len; i++){
				var qna = dialogue[i];
				var qna_content = '';
				if( typeof(qna.content) != 'undefined' && qna.content.length > 0) {
					for(var j=0; j < qna.content.length; j++) {
						var qna_content_item = qna.content[j];
						qna_content += qa_template({
							qName: (qna_content_item.qName ? qna_content_item.qName+':' : ''),
							question: qna_content_item.qContent,
							photo: witData[qna_content_item.aName] ? witData[qna_content_item.aName].photo : '',
							aName: qna_content_item.aName,
							aOrgan: witData[qna_content_item.aName] ? witData[qna_content_item.aName].organ: '',
							answer: qna_content_item.aContent
						});
					}
				}
				html += template({
					subject: qna.subject,
					video: '',
					video: (qna.video ? dlgVideoTmpl({ videoUrl: qna.video }) : ''),
					qna_content: qna_content
				});
			}
			return html;
		},

		htmlEtc: function(contents){
			if(!contents.length) return '';
			var html = '';
			var template = _.template(this.Root.find('#etc-link-tempate').html());
			for(var i = 0, len = contents.length; i < len; i++){
				html += template({ etclink: contents[i] });
			}
			return html;
		},

		paragraphs: function(contents){
			if(!contents.length) return '';
			var html = '';
			for(var i = 0, len = contents.length; i < len; i++){
				html += '<p>' + contents[i] + '</p>';
			}
			return html;
		},

		htmlWitnesses: function(witNames, witData){
			if(!witNames.length) return '';
			var html = '';
			var template = _.template(this.Root.find('#witnesses-template').html())
			for(var i = 0, len = witNames.length; i < len; i++){
				var name = witNames[i];
				if(!witData[name]) witData[name] = { organ: '', photo: ''};
				html += template({ name: name, organ: witData[name].organ, photo: witData[name].photo });
			}
			return html;
		},

		htmlMedia: function(media, gallery){
			var self = this;
			if(!media.length) return '';
			var html = '';
			var template = _.template(this.Root.find('#medium-template').html());
			for(var i = 0, len = media.length; i < len; i++){
				var type;
				if(media[i].url.match(/\.(png|jpg|svg|gif)/)) type = 'image';
				else if(media[i].url.match(/\.(hwp|pdf|docx)/)) type = 'doc';
				else type = 'video';
				var tplMedium = _.template($('#page-journal').find('#'+type+'-template').html());
				html += template({
					medium: tplMedium({ url: self.g_path[type]+media[i].url, gallery: gallery, title: media[i].url }),
					caption: media[i].caption
				});
			}
			return html;
		},

		htmlAbsMedia: function(media, gallery){
			var self = this;
			if(media.length){
				var html = '';
				for(var i = 0, len = media.length; i < len; i++){
					var type;
					if(media[i].url.match(/\.(png|jpg|svg|gif)/)) type = 'image';
					else if(media[i].url.match(/\.(hwp|pdf|docx)/)) type = 'doc';
					else if(media[i].url.match(/\.mp3/)) type = 'audio';
					else type = 'video';
					var tplMedium = _.template(this.Root.find('#abs-'+type+'-template').html());
					if(type == 'video') {
						html += '<li>'+tplMedium({ url: self.g_path[type]+media[i].url, gallery: gallery, title: media[i].caption, t_url: self.g_path[type]+media[i].url.replace(/\?.*$/,'') })+'</li>';
					} else if(type !== 'audio'){
						html += '<li>'+tplMedium({ url: self.g_path[type]+media[i].url, gallery: gallery, title: media[i].caption })+'</li>';
					} else {
						html += '<li>'+tplMedium({
							audiourl: self.g_path.audio+media[i].url,
							imgurl: self.g_path.image+media[i].image,
							gallery: gallery,
							title: media[i].caption
						})+'</li>';
					}
				}
				return html;
			}
		},

		activate: function(){
			this.Root.find('.open-inner-page').find('.refreshable').trigger('refresh');
			this.Root.find('.open-inner-page').trigger('activate');
		},

		deactivate: function(){
			this.Root.find('.open-inner-page').trigger('deactivate');
		},

		parseUrlHash: function() {
			var obj = {};
			if(window.location.hash) {
				var hash = window.location.hash.substr(1).split('-');
				obj.page = (hash.length > 0 ? hash[0] : '');
				if(obj.page == 'hearing2')
					obj.section = (hash.length > 1 ? hash[1] : 0);
				else
					obj.section = 0;
			} else {
				obj.page = '';
				obj.section = 0;
			}

			return obj;
		}
	};

	$.fn.paddingHeightAuto = function(arg){ if($.browser.desktop){
		if(arg === undefined) arg = { active: { width: 0, height: 0 } };
		if(arg.active === undefined) arg.active = { width: 0, height: 0 };
		$(this).each(function(){
			var $target = $(this);
			paddingHeightAuto($target);
			$(window).resize(function(){ paddingHeightAuto($target); });
			$target.on('refresh', function(){ paddingHeightAuto($target); });
		});
		function paddingHeightAuto($target){ if($target.is(':visible')){
			if(window.innerWidth >= arg.active.width && window.innerHeight >= arg.active.height){
				$target.css({ height: '', 'padding-top': '', 'padding-bottom': '', 'margin-top': 0, 'margin-bottom': 0 });
				var padding = ($(window).height() - $target.height()) / 2;
				$target.css({ 'padding-top': padding, 'padding-bottom': padding });
				$target.outerHeight($(window).height());
			} else {
				$target.css({ height: '', 'padding-top': '', 'padding-bottom': '', 'margin-top': '', 'margin-bottom': '' });
			}
		}}
	}}

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
		var $sections = this.$sections;
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

	$.fn.sameSizeWithParent = function(selector){
		if(selector && $.type(selector) === 'string'){
			$(this).each(function(){
				var $target = $(this);
				var $parent = $target.parents(selector);
				setSize();
				$target.on('refresh', setSize);
				$(window).resize(setSize);
				function setSize(event){
					if($parent.is(':visible') && $target.is(':visible')){
						var rect = $parent.get(0).getBoundingClientRect();
						$target.outerWidth(rect.width);
						$target.outerHeight(rect.height);
					}
				}
			});
		}
	}

	$.fn.tiltBorderLine = function(){
		$(this).each(function(){
			var $target = $(this);
			tiltBorderLine($target);
			$target.on('refresh', function(){ tiltBorderLine($target); });
			$(window).resize(function(){ tiltBorderLine($target); })
		});
		function tiltBorderLine($target){ if($target.is(':visible')){
			$target.css('transform', '');
			var deg = Math.atan($target.outerWidth() / $target.outerHeight()) * 180 / Math.PI;
			$target.css('transform', 'skewX(-'+deg+'deg)');
		}}
	}

	$.fn.sewolhearing2 = function(options) {
		return this.each(function() {
			var sewolhearing2 = new SewolHearing2($(this), options);
			$.data(this,'handler',sewolhearing2);
		});
	};

	$(document).ready(function() {
		sHearing2 = $('#page-2nd-hearing').sewolhearing2();
	});
})(jQuery);

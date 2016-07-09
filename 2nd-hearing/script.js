var _ = require('../contrib/underscore/underscore-min.js');
var sHearing2;

(function($){

	'use strict';

	function SewolHearing2(element,options) {
		var self = this;
		this.Root = jQuery( element );

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

		this.Gnavi = jQuery('.pages-stack');

		this.controller = this.parseUrlHash();
		this.init();
	}

	SewolHearing2.prototype = {
		init: function() {
			var self = this;

			var params = { data: '2nd_hearing' };
			jQuery.ajax({
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
			this.Root.find('.outline .video-wrap').extraStyle({
				ratio: (360/640)
			});
			this.Root.find('.header iframe').attr('src', self.Root.find('.header .video-wrap').attr('data-src'));
			// 첫 페이지 반응형 처리////
			var outlineBreakPoint = '320 1024';
			this.Root.find('.outline > .header .title-part-1 span').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1 2 em max'
			});
			this.Root.find('.outline > .header .title-part-2 span').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '3 6 em max'
			});
			this.Root.find('.outline > .header .title-part-3 span').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1.2 2.4 em max'
			});
			this.Root.find('.outline > .header').respStyle({
				'breakpoint': outlineBreakPoint,
				'padding-top': '3 5 em max',
				'padding-bottom': '3 5 em max'
			});
			this.Root.find('.outline > .header .video-wrap').respStyle({
				'breakpoint': outlineBreakPoint,
				'margin-bottom': '3 7 em max'
			});
			this.Root.find('.outline .content').respGrid({
				breakpoint: '320 768',
				columns: '1 2',
				ratio: 'auto',
				gutter: '0 ='
			}, 'computed');
			jQuery(window).trigger('es-setScrollbarEvent');

			// 첫 페이지의 기울어진 경계선을 위한 ////
			this.Root.find('.outline .content .part:eq(0) .tilted-border-line').addClass('refresh').tiltBorderLine();

			// 첫 페이지 의혹 제목의 hover 효과를 위한 ////
			this.Root.find('.outline .content .item .hover-text-wrap').addClass('refresh').sameSizeWithParent('.item-wrap');

			//첫 페이지 스크롤 효과 ////
			this.Root.find('.outline').scrEffectOfBgcolor({
				background: '#ffffff #1a1a1a',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#1a1a1a', '#ffffff'];
					jQuery('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					if(bgcIndex === 0){
						self.Root.find('.outline .content').find('.item-wrap > span, .title > span').css('color', '#6e6e6e');
						self.Root.find('.outline .content .tilted-border-line').stop().animate({'border-color': '#6e6e6e'}, 1000);
					} else {
						self.Root.find('.outline .content').find('.item-wrap > span, .title > span').css('color', '');
						self.Root.find('.outline .content .tilted-border-line').stop().animate({'border-color': ''}, 1000);
					}
				}
			});
			this.Root.find('.outline').trigger('deactivate-scroll-effect');
			// 의혹 페이지로 이동 ////
			this.Root.find('.outline li').click(function() {
				self.openPage(jQuery(this).attr('data-num'));
				self.Root.find('.outline .header iframe').attr('src', self.Root.find('.outline .header .video-wrap').attr('data-src'));
			});

			if(this.Gnavi !== 'undefined' && !this.Gnavi.hasClass('pages-stack--open')) {
				this._activate();
			}

			this.Root.on('append-section', function(event, index){
				self.Root.find('#suspicion-'+index).append( self.makeHtml(index-1, self.suspicions[index-1]) );
				// 데이터가 없는 요소를 숨기거나 삭제 ////
				self.Root.find('#suspicion-'+index).find('.etc').each(function(){
					if(jQuery(this).find('.links.num-0').length)
						jQuery(this).hide();
				});
				self.Root.find('#suspicion-'+index).find('.witness-photo').each(function() {
					if( !jQuery(this).attr('data-name') )
						jQuery(this).closest('.answer').hide();
				});
				// 첫 페이지로 이동 ////
				self.Root.find('#suspicion-'+index).find('.go-back-outline').click(function() {
					var num = jQuery(this).parents('section').attr('id').replace(/suspicion\-/, '');
					self.closePage(num);
//					self.Root.find('.outline .header iframe').attr('src', self.Root.find('.outline .header .video-wrap').attr('data-src')+'&autoplay=1');
					self.Root.find('.outline .header iframe').attr('src', self.Root.find('.outline .header .video-wrap').attr('data-src'));
				});
				//증인 정보 표시 ////
				self.Root.find('#suspicion-'+index).find('.witness-photo').sewolwitnesses({
					component: self
				});
				// 반응형 처리 ////
				var bpOfAbstract = '1024 1680';
				self.Root.find('#suspicion-'+index).find('.abstract .list p').respStyle({
					breakpoint: bpOfAbstract,
					'padding-top': '0 72 max',
					'padding-left': '15 72 max'
				});
				// 스크롤 효과 ////
				self.Root.find('#suspicion-'+index).scrEffectOfBgcolor({
					background: '#1a1a1a #ffffff',
					option: 'wait',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#ffffff', '#1a1a1a'];
						jQuery('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					}
				});
				// '주요 내용'의 이미지를 슬라이드로 ////
				self.Root.find('#suspicion-'+index).find('.abstract-media').slideshow({
					ratio: 35/43,
					gutter: '0'
				});
				self.Root.find('#suspicion-'+index).find('.audio-gallery').fancybox({
					padding: 0,
					afterLoad: function(current, previous){
						if(previous){
							var $audio = self.Root.find('#suspicion-'+index).find('.audio-gallery').eq(previous.index).find('audio');
							$audio.get(0).pause();
							$audio.get(0).currentTime = 0;
						}
						self.Root.find('#suspicion-'+index).find('.audio-gallery').eq(current.index).find('audio').get(0).play();
					},
					afterClose: function(){
						var $audio = self.Root.find('#suspicion-'+index).find('.audio-gallery').eq(this.index).find('audio');
						$audio.get(0).pause();
						$audio.get(0).currentTime = 0;
					}
				});
				// ////
				self.Root.find('#suspicion-'+index).addClass('visited-page');
				self.Root.find('#suspicion-'+index).find('.medium img').extraStyle({ fitted: 'yes' });
				// 스크롤 스냅 ////
/*				self.Root.find('#suspicion-'+index).scrollSnap({
					section: '.content .abstract ul.list > li, .content .dialogue',
					active: 1024
				}); */
			}); // on:append-section

			jQuery(window).resize(function(){
				var $absMediaWrap = self.Root.find('.sections section.open-inner-page .abstract-media-wrap');
				if($absMediaWrap.length){
					var amwWidth = $absMediaWrap.width();
					$absMediaWrap.find('.ps-current li > a > img').outerHeight(amwWidth * 35/43);
					$absMediaWrap.find('.play-icon i').css('font-size', amwWidth * 35/43 * 0.2);
				}
			});

			if(this.controller.section) {
				this.openPage(this.controller.section);
			}
		},

		openPage: function(pageNum) {
			this.Root.find('.outline').removeClass('open-inner-page').trigger('deactivate-scroll-effect');
			this.openAndActivatePage(pageNum);
		},

		closePage: function(pageNum) {
			this.Root.find('#suspicion-'+pageNum).removeClass('open-inner-page').trigger('deactivate-scroll-effect');
			this.Root.find('.outline').addClass('open-inner-page').trigger('activate-scroll-effect');
			this.Root.find('.outline .content').trigger('refresh-grid');
			this.Root.find('.outline .video-wrap').trigger('refresh-style');
			this.Root.find('.outline').find('.refresh').trigger('refresh');
		},

		openAndActivatePage: function(pageNum) {
			this.Root.find('#suspicion-'+pageNum).addClass('open-inner-page');
			if(!this.Root.find('#suspicion-'+pageNum).hasClass('visited-page')){
				this.Root.trigger('append-section', pageNum);
			} else {
				this.Root.find('#suspicion-'+pageNum).scrollTop(0);
			}
			this.Root.find('#suspicion-'+pageNum).trigger('activate-scroll-effect');
			this.Root.find('#suspicion-'+pageNum).find('.abstract-media').trigger('refresh-slideshow');
		},

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
			var self = this;
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
			var self = this;
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
				var tplMedium = _.template(jQuery('#page-journal').find('#'+type+'-template').html());
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

		activate: function() {
			var self = this;

			var $content = this.Root.find('.open-inner-page .content');
			if(!$content.hasClass('applied-resp-grid')) $content.addClass('applied-resp-grid').trigger('refresh-grid');
			var intv = setInterval(function(){
				if(self.Gnavi !== 'undefined' && !self.Gnavi.hasClass('pages-stack--open')) {
					clearInterval(intv);
					self._activate();
				}
			}, 200);
		},

		_activate: function() {
			var $openPage = this.Root.find('.open-inner-page');
			if($openPage.hasClass('outline')) {
				if($openPage.hasClass('visited') == false) {
					$openPage.addClass('visited');
					this.playOutlineVideo(false);
				}
			}
			$openPage.trigger('activate-scroll-effect');
			$openPage.find('.refresh').trigger('refresh');
		},

		deactivate: function() {
			var self = this;

			this.Root.find('.open-inner-page').trigger('deactivate-scroll-effect');
			if(this.Root.find('.outline.open-inner-page').length) this.playOutlineVideo(false);
		},

		playOutlineVideo(play) {
			var $openPage = this.Root.find('.outline.open-inner-page');
			var src = $openPage.find('.header .video-wrap').attr('data-src');
			if(play) src += '&autoplay=1';
			$openPage.find('.header iframe').attr('src', src);
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

	$.fn.scrollSnap = function(arg){
		if(arg === undefined) arg = {};
		if(arg.section === undefined) arg.section = 'div';
		if(arg.active === undefined) arg.active = 0;
		var $container = jQuery(this);
		if($container.length == 0){
			console.error('ERROR: .scrollSanp()');
			return;
		}
		var isSnapping = false;
		var preScrTop = 0;
		var scrDir = 'down';
		$container.scroll(function(event){ if(window.innerWidth >= arg.active){
			if(isSnapping){
				event.preventDefault();
			} else {
				var scrTop = $container.scrollTop();
				if(preScrTop < scrTop) scrDir = 'down'; else scrDir = 'up';
				preScrTop = scrTop;
				var $sections = $container.find(arg.section);
				for(var index = 0, len = $sections.length; index < len; index++){
					var top = $sections.eq(index).offset().top;
					if(scrDir === 'down' && index === 0 && 0 < top && top < jQuery(window).height()/20){
						isSnapping = true; break;
					} else if(scrDir === 'down' && $sections.eq(index-1).offset().top < -5 && 0 < top){
						isSnapping = true; break;
					}
				}
				if(isSnapping) $container.animate({ scrollTop: (scrTop+top) }, 600, 'easeOutBounce', function(){ isSnapping = false; });
			}
		}});
	}

	$.fn.slideshow = function(arg){
		if(arg === undefined) arg = {};
		if(arg.section === undefined) arg.section = 'li';
		if(arg.ratio === undefined) arg.ratio = 3/4;
		if(arg.gutter === undefined) arg.gutter = '5%';
		if(arg.bgcolor === undefined) arg.bgcolor = '#4d4d4d';
		if(arg.captbgcolor === undefined) arg.captbgcolor = '#4d4d4d';

		jQuery(this).each(function(){
			slideshow(jQuery(this));
		});

		function slideshow($contain){
			var containRatio = arg.ratio;
			var index = 0;
			var $sections = $contain.children(arg.section);
			var $mainWrap = jQuery('<div class="slideshow-wrap"></div>').appendTo($contain).append($sections);
			var $leftWrap = jQuery('<div class="left"><div class="prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></div></div>').insertBefore($mainWrap);
			var $rightWrap = jQuery('<div class="right"><div class="next"><i class="fa fa-chevron-right" aria-hidden="true"></i></div></div').insertAfter($mainWrap);

			$contain.css({ height: $contain.width() * arg.ratio, overflow: 'hidden', position: 'relative' });
			$contain.css({ overflow: 'hidden', position: 'relative' });
			$leftWrap.css({ width: arg.gutter, height: '100%', float: 'left' });
			$rightWrap.css({ width: arg.gutter, height: '100%', float: 'left' });
			var mainWidth = $contain.width() - $leftWrap.width() - $rightWrap.width() - 1;
			$mainWrap.css({ position: 'relative', width: mainWidth, height: '100%', float: 'left' });
			$sections.css({ position: 'absolute', top: 0, left: 0, diasplay: 'block',
				width: '100%', height: '100%', overflow: 'hidden', 'background-color': arg.bgcolor
			});
			$sections.children('a').css({ diasplay: 'block', width: '100%', height: '100%', overflow: 'hidden' });
			$sections.find('img').innerFit({
				afterLoad: function(){
					var maxHeight = 0;
					$sections.find('img').each(function(){
						if(jQuery(this).height() > maxHeight)
							maxHeight = jQuery(this).height() ;
					});
					if($contain.height() > maxHeight){
						$contain.css({ height: maxHeight });
						$sections.find('img').trigger('refresh-image-fit');
						containRatio = maxHeight / $contain.width();
					}
				}
			});
			$sections.find('img').each(function(){
				if(jQuery(this).attr('alt')){
					var $caption = jQuery('<div class="caption"><span>'+jQuery(this).attr('alt')+'</span></div>').insertAfter(jQuery(this));
					$caption.css({ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'auto', opacity: 0.7, 'background-color': arg.captbgcolor });
					$caption.find('span').css({ 'padding-left': '1em', 'line-height': '2em' });
				}
			});

			if($sections.length > 1){
				var $prev = $leftWrap.children('.prev'), $next = $rightWrap.children('.next');
				$prev.css({ position: 'absolute', 'z-index': '10', height: '10%', width: 'auto', top: '45%', left: 0, cursor: 'pointer' });
				$next.css({ position: 'absolute', 'z-index': '10', height: '10%', width: 'auto', top: '45%', right: 0, cursor: 'pointer' });
				$prev.children().css({ 'font-size': $prev.height() });
				$next.children().css({ 'font-size': $next.height() });

				var isChanging = false;
				$sections.not(':eq(0)').css({ left: $contain.width() });
				$next.click(function(){ if(isChanging === false){
					isChanging = true;
					var next = ( index < $sections.length-1 ? index+1 : 0 );
					$sections.eq(index).finish().animate({ left: -1*$contain.width() }, 1000, 'easeOutQuint');
					$sections.eq(next).css({ left: $contain.width() }).finish().animate({ left: 0 }, 1000, 'easeOutQuint', function(){ isChanging = false; });
					index = next;
				}});
				$prev.click(function(){if(isChanging === false){
					isChanging = true;
					var prev = ( index > 0 ? index-1 : $sections.length-1 );
					$sections.eq(index).finish().animate({ left: $contain.width() }, 1000, 'easeOutQuint');
					$sections.eq(prev).css({ left: -1*$contain.width() }).finish().animate({ left: 0 }, 1000, 'easeOutQuint', function(){ isChanging = false; });
					index = prev;
				}});
			}

			$contain.on('refresh-slideshow', refresh);
			jQuery(window).resize(refresh);
			function refresh(){ if($contain.is(':visible')){
				$contain.css({ height: $contain.width()*containRatio });
				$mainWrap.css({ width: $contain.width() - $leftWrap.width() - $rightWrap.width() - 1 });
				$sections.find('img').trigger('refresh-image-fit');
				$sections.not(':eq('+index+')').css({ left: $contain.width() });
			}}
		}//slideshow
	}

	$.fn.innerFit = function(arg){
		if(arg === undefined) arg = {};
		var numOfLoad = 0;
		var numOfImages = jQuery(this).length;
		jQuery(this).each(function(){
			var $img = jQuery(this);
			$img.load(fit);
			$img.on('refresh-image-fit', fit);
			function fit(event) {
				var $parent = $img.parent();
				$img.css({ width: '100%', height: '', 'margin-left': '', 'margin-top': '' });
				if($img.height() > $parent.height()){
					var width = $img.css({ width: '', height: $parent.height() }).width();
					$img.css({ 'margin-left': ($parent.width() - width)/2 });
				} else {
					$img.css({ 'margin-top': ($parent.height() - $img.height())/2 });
				}
				if(event.type == 'load'){
					numOfLoad++;
					if(numOfLoad == numOfImages && arg.afterLoad) arg.afterLoad();
				}
			}
		});
	}

	$.fn.sameSizeWithParent = function(selector){
		if(selector && $.type(selector) === 'string'){
			jQuery(this).each(function(){
				var $target = jQuery(this);
				var $parent = $target.parents(selector);
				setSize();
				$target.on('refresh', setSize);
				jQuery(window).resize(setSize);
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
		jQuery(this).each(function(){
			var $target = jQuery(this);
			tiltBorderLine($target);
			$target.on('refresh', function(){ tiltBorderLine($target); });
			jQuery(window).resize(function(){ tiltBorderLine($target); })
		});
		function tiltBorderLine($target){ if($target.is(':visible')){
			$target.css('transform', '');
			var deg = Math.atan($target.outerWidth() / $target.outerHeight()) * 180 / Math.PI;
			$target.css('transform', 'skewX(-'+deg+'deg)');
		}}
	}

	jQuery.fn.sewolhearing2 = function(options) {
		return this.each(function() {
			var sewolhearing2 = new SewolHearing2(jQuery(this), options);
			jQuery.data(this,'handler',sewolhearing2);
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	sHearing2 = jQuery('#page-2nd-hearing').sewolhearing2();
});

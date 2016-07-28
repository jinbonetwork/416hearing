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
		this.current = 0;

		this.pageHandler = jQuery('body').data('handler')

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
			var outlineBreakPoint = '320 1024';
			//첫 페이지 비디오 ////
			self.Root.find('.outline #hearing2-video').addClass('refreshable').extraStyle({
				ratio: (360/640)
			});
			self.Root.find('.outline #hearing2-video').respStyle({
				'breakpoint': outlineBreakPoint,
				'margin-bottom': '3 7 em max'
			});
			self.Root.find('.outline #hearing2-video').clickAndPlayYoutube();
			// 쳇 페이지 헤더 ////
			self.Root.find('.outline > .header').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'padding-top': '3 5 em max',
				'padding-bottom': '3 5 em max'
			});
			// 첫 페이지 제목 ////
			self.Root.find('.outline > .header .title-part-1 span').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1 2 em max'
			});
			self.Root.find('.outline > .header .title-part-2 span').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '3 6 em max'
			});
			self.Root.find('.outline > .header .title-part-3 span').addClass('refreshable').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1.2 2.4 em max'
			});
			// 첫 페이지 의혹 리스트 ////
			self.Root.find('.outline .content').addClass('refreshable').respGrid({
				breakpoint: '320 768',
				columns: '1 2',
				ratio: 'auto',
				gutter: '0 ='
			});

			// 첫 페이지의 기울어진 경계선을 위한 ////
			self.Root.find('.outline .content .part:eq(0) .tilted-border-line').addClass('refreshable').tiltBorderLine();

			// 첫 페이지 의혹 제목의 hover 효과를 위한 ////
			self.Root.find('.outline .content .item .hover-text-wrap').addClass('refreshable').sameSizeWithParent('.item-wrap');

			//첫 페이지 스크롤 효과 ////
			self.Root.find('.outline').scrEffectOfBgcolor({
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
			self.Root.find(".gallery").fancybox({ padding: 0 });

			// 의혹 페이지로 이동 ////
			self.Root.find('.outline li').click(function() {
				self.movePage(0, $(this).attr('data-num'),true);
			});

			// ////
			if(self.controller.section) {
				self.movePage(0, this.controller.section,true);
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
			// 로드 비디오 ////
			$susp.find('.dialogue .video-wrap').addClass('refreshable').clickAndPlayYoutube();
			// 첫 페이지로 이동 ////
			$susp.find('.go-back-outline').click(function() {
				var num = $(this).parents('section').attr('id').replace(/suspicion\-/, '');
				self.movePage(num, 0,true);
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

		movePage: function(nFrom, nTo, history){
			var $from = ( nFrom == 0 ? this.Root.find('.outline') : this.Root.find('#suspicion-'+nFrom) );
			var $to = ( nTo == 0 ? this.Root.find('.outline') : this.Root.find('#suspicion-'+nTo) );

			//이전 페이지 닫기 ///
			if( history === true && nFrom != nTo ) {
				this.pageHandler.pushHistory(this.Root.attr('id'),nFrom,nTo);
			}
			if(nFrom == 0){
				// 첫 페이지 비디오 재생 중지 ////
				var hearing2Video = $from.find('#hearing2-video').data('ytplayer');
				if(hearing2Video) hearing2Video.stopVideo();
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
			this.current = nTo;

			hash = "hearing2";
			if(nTo) hash += "-"+nTo;
			if(window.location.hash != hash) {
				window.location.hash = hash;
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
			var dlgVideoTmpl = _.template(this.Root.find('#dialogue-video-template').html());
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

		getCurrent: function() {
			return this.current;
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

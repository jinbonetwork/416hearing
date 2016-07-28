var _ = require('../contrib/underscore/underscore-min.js');
var sHearing1;

(function($){

	//'use strict';

	function SewolHearing1(element,options) {
		this.Root = $( element );

		this.settings = $.extend({}, $.fn.sewolhearing1.defaults, options);

		this.parts = undefined;
		this.suspicions = undefined;
		this.witnesses = undefined;
		this.partMap = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2];

		this.controller = this.parseUrlHash();

		this.current = 0;

		this.navigation = undefined;

		this.pageHandler = jQuery('body').data('handler');

		this.init();
	}

	SewolHearing1.prototype = {
		init: function() {
			var self = this;

			var params = { data: 'hearing' };
			$.ajax({
				url: './api.php',
				data: params,
				dataType: 'json',
				method: 'GET',
				success: function(json) {
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

			this.navigation = this.htmlNavigation();
		},

		initEvent: function() {
			var self = this;

			//첫 페이지 의혹 리스트의 파트를 위한 그리드 ////
			this.Root.find('.outline .content').addClass('refreshable').respGrid({
				breakpoint: '320 560 768 1024 1280',
				columns: '1 1 2 3 3',
				ratio: 'auto',
				gutter: '10 - - - 40'
			}, 'computed');

			//스크롤 효과 ////
			this.Root.find('.outline').scrEffectOfBgcolor({
				background: '#ffffff #1a1a1a',
				after: function($contain, bgcolor, bgcIndex) {
					var colors = ['#1a1a1a', '#ffffff'];
					$('button.menu-button i').stop().animate({ color: colors[bgcIndex] }, 1000);
					self.Root.find('.outline .header .title-part-2 span').css('color', colors[bgcIndex]);
					self.Root.find('.outline .content').find('.item span, .title span.main').css('color', colors[bgcIndex]);
				}
			});

			// 의혹 페이지로 이동 ////
			this.Root.find('.outline li').click(function() {
				self.movePage(0, $(this).attr('data-num'),true);
			});

			// ////
			if(this.controller.section) {
				this.movePage(0, this.controller.section,true);
			}
		},

		appendSection: function(index){
			var self = this;
			var $susp = self.Root.find('#suspicion-'+index);
			$susp.addClass('visited-page').append(self.makeHtml(index-1, self.suspicions[index-1], this.navigation));

			$susp.find('.etc').each(function() {
				if( $(this).find('.media.size-0').length && $(this).find('.links.num-0').length )
					$(this).hide();
			});
			$susp.find('.witness-photo').each(function() {
				if(!$(this).attr('data-name')) $(this).closest('.answer').hide();
			});

			$susp.scrEffectOfBgcolor({
				background: '#1a1a1a #ffffff',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#ffffff', '#1a1a1a'];
					$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					if(bgcIndex === 1) $contain.find('.background > p, .title-wrapper > span').css('color', '#4d4d4d');
					else $contain.find('.background > p, .title-wrapper > span').css('color', '');
				}
			});
			$susp.scrEffectOfTitle({
				title: '.fixed-element',
				position: 'right',
				option: 'wait',
				active: 1024,
				after: function($contain){
					var $partTitle = $contain.find('.header .part-title');
					if($partTitle.length){
						var right = $partTitle.offset().left + $partTitle.outerWidth();
						var $goOutline = $contain.find('.header .go-back-outline');
						$goOutline.css('margin-left', '');
						if(right > $goOutline.offset().left){
							$goOutline.css('margin-left', right - $goOutline.offset().left + 15);
						}
					}
				}
			});

			//이미지 회색톤 및 크롭 ////
			$susp.find('.witness-photo > .photo-wrap img').addClass('grayscale').gray();
			$susp.find('.medium img').addClass('refreshable').extraStyle({ fitted: 'yes' });
			//$susp.find('.medium img').addClass('grayscale grayscale-fade').gray();

			//팬시박스 설정 ////
			$susp.find(".gallery").fancybox({ padding: 0 });

			$susp.find('.go-back-outline').click(function(){
				var num = $(this).parents('section').attr('id').replace(/suspicion\-/, '');
				self.movePage(num, 0,true);
			});

			// 네비게이션 동작 ////
			$susp.find('.navigation .header').click(function() {
				if($(this).parents('.part').hasClass('folded')){
					$(this).parents('.navigation').find('.part:not(.folded)').addClass('folded').children('ul').animate({height: 0}, 500);
					$(this).parents('.part').removeClass('folded');
					var height = $(this).siblings('ul').css('height', '').height();
					$(this).siblings('ul').height(0);
					$(this).siblings('ul').stop().animate({height: height}, 500);
				} else {
					$(this).parents('.part').addClass('folded');
					$(this).siblings('ul').stop().animate({height: 0}, 500);
				}
			});
			$susp.find('.navigation li').click(function() {
				var pastNum = $(this).parents('.navigation').find('.selected').find('.num').text();
				self.movePage( pastNum, $(this).find('.num').text(),true );
			});

			//증인 정보 표시 ////
			$susp.find('.witness-photo').sewolwitnesses({
				component: self
			});
		},

		movePage: function(nFrom, nTo, history){
			var $from = ( nFrom == 0 ? this.Root.find('.outline') : this.Root.find('#suspicion-'+nFrom) );
			var $to = ( nTo == 0 ? this.Root.find('.outline') : this.Root.find('#suspicion-'+nTo) );

			//이전 페이지 닫기 ////
			$from.removeClass('open-inner-page').trigger('deactivate');

			if( history === true && nFrom != nTo ) {
				this.pageHandler.pushHistory(this.Root.attr('id'),nFrom, nTo);
			}

			if(nFrom > 0){
				$from.find('.navigation .selected').removeClass('selected').parents('.part').addClass('folded');
			}

			//현재 페이지 여기 ////
			$to.addClass('open-inner-page');
			if($to.hasClass('visited-page')){
				$to.find('.refreshable').trigger('refresh');
				$to.trigger('activate');
				$to.scrollTop(0);
			} else {
				this.appendSection(nTo);
			}
			if(nTo > 0){
				$to.find('.navigation li').eq(nTo-1).addClass('selected').parents('.part').removeClass('folded');
			}
			this.current = nTo;

		},//movePage

		htmlOutline: function() {
			var self = this;
			var template = _.template(self.Root.find('#outline-template').html());
			var tplSuspicions = _.template(self.Root.find('#outline-suspicion-template').html());
			var html = '';
			for(var i = 0, leni = this.parts.length; i < leni; i++){
				var susp = '';
				for(var j = 0, lenj = this.partMap.length; j < lenj; j++){
					if(this.partMap[j] == i) susp += tplSuspicions({ num: j+1, item: this.suspicions[j].title });
				}
				html += template({
					partNum: i + 1,
					title: self.parts[i].title,
					subtitle: self.parts[i].sub_title,
					supicions: susp
				});
			}
			return html;
		},

		htmlNavigation: function(){
			var self = this;
			var template = _.template(self.Root.find('#navigation-template').html());
			var tplSuspicions = _.template(self.Root.find('#nav-suspicion-template').html());
			var html = '';
			for(var i = 0, leni = this.parts.length; i < leni; i++){
				var susp = '';
				for(var j = 0, lenj = this.partMap.length; j < lenj; j++){
					if(this.partMap[j] == i) susp += tplSuspicions({ num: j+1, item: this.suspicions[j].title });
				}
				html += template({
					title: self.parts[i].title,
					subtitle: self.parts[i].sub_title,
					supicions: susp
				});
			}
			return html;
		},

		makeHtml: function(sectNum, section, navigation){
			var self = this;
			var tplSection = _.template(self.Root.find('#section-template').html());
			if(_.isEmpty(section)) return;
			return tplSection({
				section: sectNum + 1,
				partNum: self.partMap[sectNum] + 1,
				partMainTitle: self.parts[self.partMap[sectNum]].title,
				partSubtitle: self.parts[self.partMap[sectNum]].sub_title,
				titleNum: sectNum + 1,
				title: section.title,
				bgMediaSize: self.mediaSize(section.background.media),
				bgMedia: self.htmlMedia(section.background.media, 'hr'+sectNum+'bg'),
				background: section.background.content,
				witness: self.htmlWitnesses(section.witnesses, self.witnesses),
				abstract: self.paragraphs(section.abstract.content),
				abMediaSize: self.mediaSize(section.abstract.media),
				abMedia: self.htmlMedia(section.abstract.media, 'hr'+sectNum+'ab'),
				dialogue: self.htmlDialogue(section.dialogue, self.witnesses, 'hr'+sectNum+'da'),
				conclusion: self.paragraphs(section.conclusion.content),
				concMediaSize: self.mediaSize(section.conclusion.media),
				concMedia: self.htmlMedia(section.conclusion.media, 'hr'+sectNum+'md'),
				etcMediaSize: self.mediaSize(section.etc.media),
				etcMedia: self.htmlMedia(section.etc.media, 'hr'+sectNum+'et'),
				etcLinkNum: section.etc.content.length,
				etcLinks: self.htmlEtc(section.etc.content),
				navigation: navigation
			});
		},

		mediaSize: function(media){
			if(media.length == 0) return '0';
			else return media.length + (media[0].size == 's=b' ? '-big' : '-small');
		},

		htmlDialogue: function(dialogue, witData, gallery){
			var self = this;
			var html = '';
			var template = _.template(self.Root.find('#dialogue-template').html());
			for(var i = 0, len = dialogue.length; i < len; i++){
				var qna = dialogue[i];
				html += template({
					qName: qna.qName,
					question: self.paragraphs(qna.qContent),
					qMediaSize: self.mediaSize(qna.qMedia),
					qMedia: self.htmlMedia(qna.qMedia, gallery+'q'),
					photo: witData[qna.aName] ? witData[qna.aName].photo : '',
					aName: qna.aName,
					aOrgan: witData[qna.aName] ? witData[qna.aName].organ: '',
					answer: self.paragraphs(qna.aContent),
					aMediaSize:  self.mediaSize(qna.aMedia),
					aMedia: self.htmlMedia(qna.aMedia, gallery+'a')
				});
			}
			return html;
		},

		htmlEtc: function(contents){
			var self = this;
			if(!contents.length) return '';
			var html = '';
			var template = _.template(self.Root.find('#etc-link-tempate').html());
			for(var i = 0, len = contents.length; i < len; i++){
				html += template({ etclink: contents[i] });
			}
			return html;
		},

		paragraphs: function(contents) {
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
			var template = _.template(self.Root.find('#witnesses-template').html())
			for(var i = 0, len = witNames.length; i < len; i++){
				var name = witNames[i];
				if(!witData[name]) witData[name] = { organ: '', photo: ''};
				html += template({ name: name, organ: witData[name].organ, photo: witData[name].photo });
			}
			return html;
		},

		htmlMedia: function(media, gallery) {
			var self = this;
			if(!media.length) return '';
			var html = '';
			var template = _.template(self.Root.find('#medium-template').html());
			for(var i = 0, len = media.length; i < len; i++){
				var type;
				if(media[i].url.match(/\.(png|jpg|svg|gif)/)) type = 'image';
				else if(media[i].url.match(/\.(hwp|pdf|docx)/)) type = 'doc';
				else type = 'video';
				var tplMedium = _.template($('#page-journal').find('#'+type+'-template').html());
				var title = media[i].url.replace(/.+\//g, '');
				html += template({
					medium: tplMedium({ url: media[i].url, gallery: gallery, title: title }),
					caption: media[i].caption
				});
			}
			return html;
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
				if(obj.page == 'hearing1')
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

	$.fn.sewolhearing1 = function(options) {
		return this.each(function() {
			var sewolhearing1 = new SewolHearing1($(this), options);
			$.data(this,'handler',sewolhearing1);
		});
	};

	$(document).ready(function() {
		sHearing1 = $('#page-hearing').sewolhearing1();
	});

})(jQuery);

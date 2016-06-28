var _ = require('../contrib/underscore/underscore-min.js');
var getWitness = require('./witnesses.js');

(function($){
	var g_path = {
		root: 'data/2nd_hearing/',
		image: 'data/2nd_hearing/images/',
		doc: 'data/2nd_hearing/docs/',
		audio: 'data/2nd_hearing/audio/',
		video: ''
	}
	$(document).ready(function(){
		var parts = undefined;
		var suspicions = undefined;
		var witnesses = undefined;
		var partMap = [0, 0, 0, 1, 1, 1];
		$.ajax({
			url: g_path.root+'suspicions.json', dataType: 'json',
			success: function(json){ suspicions = json; },
			complete: function(){ $hr2().trigger('json-load'); }
		});
		$.ajax({
			url: g_path.root+'parts.json', dataType: 'json',
			success: function(json){ parts = json; },
			complete: function(){ $hr2().trigger('json-load'); }
		});
		$.ajax({
			url: g_path.root+'witnesses.json', dataType: 'json',
			success: function(json){ witnesses = json; },
			complete: function(){ $hr2().trigger('json-load'); }
		});
		$hr2().on('json-load', function(){ if(parts && suspicions && witnesses){
			$hr2('.outline .content').append(htmlOutline(parts, partMap, suspicions));
			$hr2('.outline .video-wrap').extraStyle({
				ratio: (360/640)
			});
			// 첫 페이지 반응형 처리////
			var outlineBreakPoint = '320 1024';
			$hr2('.outline > .header .title-part-1 span').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1 2 em max'
			});
			$hr2('.outline > .header .title-part-2 span').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '3 6 em max'
			});
			$hr2('.outline > .header .title-part-3 span').respStyle({
				'breakpoint': outlineBreakPoint,
				'font-size': '1.2 2.4 em max'
			});
			$hr2('.outline > .header').respStyle({
				'breakpoint': outlineBreakPoint,
				'padding-top': '3 5 em max',
				'padding-bottom': '3 5 em max'
			});
			$hr2('.outline > .header .video-wrap').respStyle({
				'breakpoint': outlineBreakPoint,
				'margin-bottom': '3 7 em max'
			});
			$hr2('.outline .content').respGrid({
				breakpoint: '320 768',
				columns: '1 2',
				ratio: 'auto',
				gutter: '0 ='
			}, 'computed');
			$(window).trigger('es-setScrollbarEvent');
			// ////
			$hr2('.outline .content .item .hover-text-wrap').addClass('refresh').sameSizeWithParent('.item-wrap');
			//스크롤 효과 ////
			$hr2('.outline').scrEffectOfBgcolor({
				background: '#ffffff #1a1a1a',
				option: 'wait',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#1a1a1a', '#ffffff'];
					$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					if(bgcIndex === 0){
						$hr2('.outline .content').find('.item-wrap > span, .title > span').css('color', '#6e6e6e');
					} else {
						$hr2('.outline .content').find('.item-wrap > span, .title > span').css('color', '');
					}
				}
			});
			$hr2('.outline').trigger('deactivate-scroll-effect');
			// 의혹 페이지로 이동 ////
			$hr2('.outline li').click(function(){
				openPage($(this).attr('data-num'));
				$hr2('.outline .header iframe').attr('src', $hr2('.outline .header .video-wrap').attr('data-src'));
			});

			// ////
			for(var i = 1, leni = partMap.length; i <= leni; i++){
				$hr2('.sections').append('<section id="suspicion-'+i+'" class="inner-page"></section>');
			}
			$hr2().on('append-section', function(event, index){
				$hr2('#suspicion-'+index).append(makeHtml(index-1, parts, suspicions[index-1], witnesses, partMap));
				// 데이터가 없는 요소를 숨기거나 삭제 ////
				$hr2('#suspicion-'+index).find('.etc').each(function(){
					if($(this).find('.links.num-0').length) $(this).hide();
				});
				$hr2('#suspicion-'+index).find('.witness-photo').each(function(){
					if(!$(this).attr('data-name')) $(this).closest('.answer').hide();
				});
				// 첫 페이지로 이동 ////
				$hr2('#suspicion-'+index).find('.go-back-outline').click(function(){
					var num = $(this).parents('section').attr('id').replace(/suspicion\-/, '');
					closePage(num);
					$hr2('.outline .header iframe').attr('src', $hr2('.outline .header .video-wrap').attr('data-src')+'&autoplay=1');
				});
				//증인 정보 표시 ////
				$hr2('#suspicion-'+index).find('.witness-photo').click(function(e) {
					var name = $(this).attr('data-name');
					getWitness(name, $(this));
				});
				// 반응형 처리 ////
				var bpOfAbstract = '1024 1680';
				$hr2('#suspicion-'+index).find('.abstract .list p').respStyle({
					breakpoint: bpOfAbstract,
					'padding-top': '0 72 max',
					'padding-left': '15 72 max'
				});
				// 스크롤 효과 ////
				$hr2('#suspicion-'+index).scrEffectOfBgcolor({
					background: '#1a1a1a #ffffff',
					option: 'wait',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#ffffff', '#1a1a1a'];
						$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					}
				});
				// '주요 내용'의 이미지를 슬라이드로 ////
				$hr2('#suspicion-'+index).find('.abstract-media').slideshow({
					ratio: 35/43,
					gutter: '0'
				});
				$hr2('#suspicion-'+index).find('.audio-gallery').fancybox({
					padding: 0,
					afterLoad: function(current, previous){
						if(previous){
							var $audio = $hr2('#suspicion-'+index).find('.audio-gallery').eq(previous.index).find('audio');
							$audio.get(0).pause();
							$audio.get(0).currentTime = 0;
						}
						$hr2('#suspicion-'+index).find('.audio-gallery').eq(current.index).find('audio').get(0).play();
					},
					afterClose: function(){
						var $audio = $hr2('#suspicion-'+index).find('.audio-gallery').eq(this.index).find('audio');
						$audio.get(0).pause();
						$audio.get(0).currentTime = 0;
					}
				});
				// ////
				$hr2('#suspicion-'+index).addClass('visited-page');
				$hr2('#suspicion-'+index).find('.medium img').extraStyle({ fitted: 'yes' });
				// 스크롤 스냅 ////
				$hr2('#suspicion-'+index).scrollSnap({
					section: '.content .abstract ul.list > li, .content .dialogue',
					active: 1024
				});
			}); // on:append-section

			$(window).resize(function(){
				var $absMediaWrap = $hr2('.sections section.open-inner-page .abstract-media-wrap');
				if($absMediaWrap.length){
					var amwWidth = $absMediaWrap.width();
					$absMediaWrap.find('.ps-current li > a > img').outerHeight(amwWidth * 35/43);
					$absMediaWrap.find('.play-icon i').css('font-size', amwWidth * 35/43 * 0.2);
				}
			});
		}});// on:json-load,
	});//document.ready
	function openPage(pageNum){
		$hr2('.outline').removeClass('open-inner-page').trigger('deactivate-scroll-effect');
		openAndActivatePage(pageNum);
	}
	function closePage(pageNum){
		$hr2('#suspicion-'+pageNum).removeClass('open-inner-page').trigger('deactivate-scroll-effect');
		$hr2('.outline').addClass('open-inner-page').trigger('activate-scroll-effect');
		$hr2('.outline .content').trigger('refresh-grid');
		$hr2('.outline .video-wrap').trigger('refresh-style');
		$hr2('outline').find('.refresh').tirgger('refresh');
	}
	function openAndActivatePage(pageNum){
		$hr2('#suspicion-'+pageNum).addClass('open-inner-page');
		if(!$hr2('#suspicion-'+pageNum).hasClass('visited-page')){
			$hr2().trigger('append-section', pageNum);
		} else {
			$hr2('#suspicion-'+pageNum).scrollTop(0);
		}
		$hr2('#suspicion-'+pageNum).trigger('activate-scroll-effect');
		$hr2('#suspicion-'+pageNum).find('.abstract-media').trigger('refresh-slideshow');
	}
	function htmlOutline(parts, partMap, suspicions){
		var template = _.template($hr2('#outline-template').html());
		var tplSuspicions = _.template($hr2('#outline-suspicion-template').html());
		var html = '';
		for(var i = 0, leni = parts.length; i < leni; i++){
			var susp = '';
			for(var j = 0, lenj = partMap.length; j < lenj; j++){
				if(partMap[j] == i) susp += tplSuspicions({ num: j+1, item: suspicions[j].title });
			}
			html += template({
				partNum: i + 1,
				title: parts[i].title,
				supicions: susp
			});
		}
		return html;
	}
	function makeHtml(sectNum, parts, section, witnesses, partMap){
		var tplSection = _.template($hr2('#section-template').html());
		if(_.isEmpty(section)) return;
		return tplSection({
			section: sectNum + 1,
			partNum: partMap[sectNum] + 1,
			partMainTitle: parts[partMap[sectNum]].title,
			titleNum: sectNum + 1,
			title: section.title,
			bgMediaSize: mediaSize(section.background.media),
			bgMedia: htmlMedia(section.background.media, 'hr2'+sectNum+'bg'),
			background: section.background.content,
			witness: htmlWitnesses(section.witnesses, witnesses),
			abstract: htmlAbstract(section.abstract, 'hr2'+sectNum+'ab'),
			dialogue: htmlDialogue(section.dialogue, witnesses, 'hr2'+sectNum+'da'),
			etcMediaSize: mediaSize(section.etc.media),
			etcMedia: htmlMedia(section.etc.media, 'hr2'+sectNum+'etc'),
			etcLinkNum: section.etc.content.length,
			etcLinks: htmlEtc(section.etc.content)
		});
	}
	function mediaSize(media){
		if(media.length == 0) return '0';
		else return media.length + (media[0].size == 's=b' ? '-big' : '-small');
	}
	function htmlAbstract(abstract, gallery){
		var html = '';
		var template = _.template($hr2('#abstract-template').html());
		for(var i = 0, len = abstract.length; i < len; i++){
			var abs = abstract[i];
			html += template({
				abstractMedia: (abs.media.length ? htmlAbsMedia(abs.media, gallery+'p'+i) : ''),
				abstract: abs.content
			});
		}
		return html;
	}
	function htmlDialogue(dialogue, witData, gallery){
		var html = '';
		var template = _.template($hr2('#dialogue-template').html());
		var dlgVideoTmpl = _.template($hr2('#dialogue-video-tempate').html());
		for(var i = 0, len = dialogue.length; i < len; i++){
			var qna = dialogue[i];
			html += template({
				subject: qna.subject,
				video: '',
				video: (qna.video ? dlgVideoTmpl({ videoUrl: qna.video }) : ''),
				qName: qna.qName,
				question: paragraphs(qna.qContent),
				photo: witData[qna.aName] ? g_path.image+witData[qna.aName].photo : '',
				aName: qna.aName,
				aOrgan: witData[qna.aName] ? witData[qna.aName].organ: '',
				answer: paragraphs(qna.aContent)
			});
		}
		return html;
	}
	function htmlEtc(contents){
		if(!contents.length) return '';
		var html = '';
		var template = _.template($hr2('#etc-link-tempate').html());
		for(var i = 0, len = contents.length; i < len; i++){
			html += template({ etclink: contents[i] });
		}
		return html;
	}
	function paragraphs(contents){
		if(!contents.length) return '';
		var html = '';
		for(var i = 0, len = contents.length; i < len; i++){
			html += '<p>' + contents[i] + '</p>';
		}
		return html;
	}
	function htmlWitnesses(witNames, witData){
		if(!witNames.length) return '';
		var html = '';
		var template = _.template($hr2('#witnesses-template').html())
		for(var i = 0, len = witNames.length; i < len; i++){
			var name = witNames[i];
			if(!witData[name]) witData[name] = { organ: '', photo: ''};
			html += template({ name: name, organ: witData[name].organ, photo: g_path.image+witData[name].photo });
		}
		return html;
	}
	function htmlMedia(media, gallery){
		if(!media.length) return '';
		var html = '';
		var template = _.template($hr2('#medium-template').html());
		for(var i = 0, len = media.length; i < len; i++){
			var type;
			if(media[i].url.match(/\.(png|jpg|svg|gif)/)) type = 'image';
			else if(media[i].url.match(/\.(hwp|pdf|docx)/)) type = 'doc';
			else type = 'video';
			var tplMedium = _.template($('#page-journal').find('#'+type+'-template').html());
			html += template({
				medium: tplMedium({ url: g_path[type]+media[i].url, gallery: gallery, title: media[i].url }),
				caption: media[i].caption
			});
		}
		return html;
	}
	function htmlAbsMedia(media, gallery){ if(media.length){
		var html = '';
		for(var i = 0, len = media.length; i < len; i++){
			var type;
			if(media[i].url.match(/\.(png|jpg|svg|gif)/)) type = 'image';
			else if(media[i].url.match(/\.(hwp|pdf|docx)/)) type = 'doc';
			else if(media[i].url.match(/\.mp3/)) type = 'audio';
			else type = 'video';
			var tplMedium = _.template($hr2('#abs-'+type+'-template').html());
			if(type !== 'audio'){
				html += '<li>'+tplMedium({ url: g_path[type]+media[i].url, gallery: gallery, title: media[i].caption })+'</li>';
			} else {
				html += '<li>'+tplMedium({
					audiourl: g_path.audio+media[i].url,
					imgurl: g_path.image+media[i].image,
					gallery: gallery,
					title: media[i].caption
				})+'</li>';
			}
		}
		return html;
	}}
	function $hr2(selector){
		if(selector) return $('#page-2nd-hearing').find(selector);
		else return $('#page-2nd-hearing');
	}
	$.fn.scrollSnap = function(arg){
		if(arg === undefined) arg = {};
		if(arg.section === undefined) arg.section = 'div';
		if(arg.active === undefined) arg.active = 0;
		var $container = $(this); if($container.length == 0){ console.error('ERROR: .scrollSanp()'); return; }
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
					if(scrDir === 'down' && index === 0 && 0 < top && top < $(window).height()/20){
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

		$(this).each(function(){
			slideshow($(this));
		});
		function slideshow($contain){
			var containRatio = arg.ratio;
			var index = 0;
			var $sections = $contain.children(arg.section);
			var $mainWrap = $('<div class="slideshow-wrap"></div>').appendTo($contain).append($sections);
			var $leftWrap = $('<div class="left"><div class="prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></div></div>').insertBefore($mainWrap);
			var $rightWrap = $('<div class="right"><div class="next"><i class="fa fa-chevron-right" aria-hidden="true"></i></div></div').insertAfter($mainWrap);

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
						if($(this).height() > maxHeight) maxHeight = $(this).height() ;
					});
					if($contain.height() > maxHeight){
						$contain.css({ height: maxHeight });
						$sections.find('img').trigger('refresh-image-fit');
						containRatio = maxHeight / $contain.width();
					}
				}
			});
			$sections.find('img').each(function(){ if($(this).attr('alt')){
				var $caption = $('<div class="caption"><span>'+$(this).attr('alt')+'</span></div>').insertAfter($(this));
				$caption.css({ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'auto', opacity: 0.7, 'background-color': arg.captbgcolor });
				$caption.find('span').css({ 'padding-left': '1em', 'line-height': '2em' });
			}});

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
			$(window).resize(refresh);
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
		var numOfImages = $(this).length;
		$(this).each(function(){
			var $img = $(this);
			$img.load(fit);
			$img.on('refresh-image-fit', fit);
			function fit(event){
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
		}
	);}
	$.fn.sameSizeWithParent = function(selector){ if(selector && $.type(selector) === 'string'){
		$(this).each(function(){
			var $target = $(this);
			var $parent = $target.parents(selector);
			setSize();
			$target.on('refresh', setSize);
			$(window).resize(setSize);
			function setSize(event){ if(event) console.log('refresh');
				if($parent.is(':visible') && $target.is(':visible')){
					var rect = $parent.get(0).getBoundingClientRect();
					$target.outerWidth(rect.width);
					$target.outerHeight(rect.height);
				}
			}
		});
	}}
})(jQuery);

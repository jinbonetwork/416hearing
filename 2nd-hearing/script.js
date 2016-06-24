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
		$hr2().on('json-load', function(){
			if(parts !== undefined && suspicions !== undefined && witnesses !== undefined){
				$hr2('.outline .content').append(htmlOutline(parts, partMap, suspicions));
				for(var i = 0, leni = partMap.length; i < leni; i++){
					$hr2('.sections').append(makeHtml(i, parts, suspicions[i], witnesses, partMap));
				}
				$hr2('.etc').each(function(){
					if($(this).find('.links.num-0').length) $(this).hide();
				});
				$hr2('.witness-photo').each(function(){
					if(!$(this).attr('data-name')) $(this).closest('.answer').hide();
				});
				$hr2('.abstract-media-wrap').each(function(){
					if($(this).find('ul li').length < 1) $(this).remove();
				});

				$hr2('.outline .video-wrap').extraStyle({
					ratio: (360/640)
				});

				//스크롤 효과 ////
				$hr2('.outline').scrEffectOfBgcolor({
					background: '#ffffff #1a1a1a',
					option: 'wait',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#1a1a1a', '#ffffff'];
						$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
						//$hr2('.outline .header .title-part-2 span').css('color', colors[bgcIndex]);
						//$hr2('.outline .content').find('.item span, .title span.main').css('color', colors[bgcIndex]);
					}
				});
				$hr2('section').scrEffectOfBgcolor({
					background: '#1a1a1a #ffffff',
					option: 'wait',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#ffffff', '#1a1a1a'];
						$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
					}
				});
				$hr2('section').scrEffectOfTitle({
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
				$hr2('.outline').trigger('deactivate-scroll-effect');
				$hr2('section').trigger('deactivate-scroll-effect');

				// '주요 내용'의 이미지를 제외한 이미지 크롭 ////
				$hr2('.medium img').extraStyle({ fitted: 'yes' }, 'wait');

				// '주요 내용'의 이미지를 슬라이드로 ////
				$hr2('.abstract-media').pgwSlideshow({ displayList: false });
				$hr2('section').each(function(sectIdx){
					$(this).find('.abstract-media-wrap .pgwSlideshow').each(function(wrapIdx){
						var $slideshow = $(this);
						$slideshow.find('.ps-current > ul > li').each(function(){
							var elt = $(this).attr('class');
							$(this).empty().append($slideshow.find('.ps-list > ul > li.'+elt+' > span > a'));
						});
					});
				});
				$hr2('.audio-gallery').fancybox({
					padding: 0,
					afterLoad: function(current, previous){
						if(previous){
							var $audio = $hr2('.audio-gallery').eq(previous.index).find('audio');
							$audio.get(0).pause();
							$audio.get(0).currentTime = 0;
						}
						$hr2('.audio-gallery').eq(current.index).find('audio').get(0).play();
					},
					afterClose: function(){
						var $audio = $hr2('.audio-gallery').eq(this.index).find('audio');
						$audio.get(0).pause();
						$audio.get(0).currentTime = 0;
					}
				});

				$(window).resize(function(){
					var $absMediaWrap = $hr2('.sections section.open-inner-page .abstract-media-wrap');
					var amwWidth = $absMediaWrap.width();
					$absMediaWrap.find('.ps-current li > a > img').outerHeight(amwWidth * 3/4);
				});

				// 의혹 페이지로 이동 ////
				$hr2('.outline li').click(function(){
					openPage($(this).attr('data-num'));
					$hr2('.outline .header iframe').attr('src', $hr2('.outline .header .video-wrap').attr('data-src'));
				});
				$hr2('.go-back-outline').click(function(){
					var num = $(this).parents('section').attr('id').replace(/suspicion\-/, '');
					closePage(num);
					$hr2('.outline .header iframe').attr('src', $hr2('.outline .header .video-wrap').attr('data-src')+'&autoplay=1');
				});

				//증인 정보 표시 ////
				$hr2('.witness-photo').click(function(e) {
					var name = $(this).attr('data-name');
					getWitness(name, $(this));
				});
			}
		});
	});
	function openPage(pageNum){
		$hr2('.outline').removeClass('open-inner-page').trigger('deactivate-scroll-effect');
		openAndActivatePage(pageNum);
	}
	function closePage(pageNum){
		$hr2('.outline').addClass('open-inner-page').trigger('activate-scroll-effect');
		$hr2('#suspicion-'+pageNum).removeClass('open-inner-page').trigger('deactivate-scroll-effect');
	}
	function openAndActivatePage(pageNum){
		$hr2('#suspicion-'+pageNum).addClass('open-inner-page');
		if(!$hr2('#suspicion-'+pageNum).hasClass('visited-page')){
			$(window).trigger('resize'); //'주요내용'의 슬라이드를 위해서.
			$hr2('#suspicion-'+pageNum).addClass('visited-page');
			$hr2('#suspicion-'+pageNum+' .medium img').trigger('refresh-fitting-image');
		} else {
			$hr2('#suspicion-'+pageNum).scrollTop(0);
		}
		$hr2('#suspicion-'+pageNum).trigger('activate-scroll-effect');
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
			partSubtitle: parts[partMap[sectNum]].sub_title,
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
				photo: witData[qna.aName] ? witData[qna.aName].photo : '',
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
})(jQuery);

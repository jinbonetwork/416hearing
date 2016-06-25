var _ = require('../contrib/underscore/underscore-min.js');
var getWitness = require('./witnesses.js');

(function($){
	$(document).ready(function(){
		var parts = undefined;
		var suspicions = undefined;
		var witnesses = undefined;
		var partMap = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2];
		$.ajax({
			url: 'data/1st_hearing/suspicions.json', dataType: 'json',
			success: function(json){ suspicions = json; },
			complete: function(){ $hr().trigger('json-load'); }
		});
		$.ajax({
			url: 'data/1st_hearing/parts.json', dataType: 'json',
			success: function(json){ parts = json; },
			complete: function(){ $hr().trigger('json-load'); }
		});
		$.ajax({
			url: 'data/1st_hearing/witnesses.json', dataType: 'json',
			success: function(json){ witnesses = json; },
			complete: function(){ $hr().trigger('json-load'); }
		});
		$hr().on('json-load', function(){
			if(parts !== undefined && suspicions !== undefined && witnesses !== undefined){
				$hr('.outline .content').append(htmlOutline(parts, partMap, suspicions));
				var navigation = htmlNavigation(parts, partMap, suspicions);
				for(var i = 0, leni = suspicions.length; i < leni; i++) {
					$hr('.sections').append(makeHtml(i, parts, suspicions[i], witnesses, partMap, navigation));
				}
				$hr('.etc').each(function(){
					if($(this).find('.media.size-0').length && $(this).find('.links.num-0').length) $(this).hide();
				});
				$hr('.witness-photo').each(function(){
					if(!$(this).attr('data-name')) $(this).closest('.answer').hide();
				});

				//첫 페이지 의혹 리스트의 파트를 위한 그리드 ////
				$hr('.outline .content').respGrid({
					breakpoint: '320 560 768 1024 1280',
					columns: '1 1 2 3 3',
					ratio: 'auto',
					gutter: '10 - - - 40'
				}, 'computed');
				$(window).trigger('es-setScrollbarEvent');

				//스크롤 효과 ////
				$hr('.outline').scrEffectOfBgcolor({
					background: '#ffffff #1a1a1a',
					option: 'wait',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#1a1a1a', '#ffffff'];
						$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
						$hr('.outline .header .title-part-2 span').css('color', colors[bgcIndex]);
						$hr('.outline .content').find('.item span, .title span.main').css('color', colors[bgcIndex]);
					}
				});
				$hr('section').scrEffectOfBgcolor({
					background: '#1a1a1a #ffffff',
					option: 'wait',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#ffffff', '#1a1a1a'];
						$('button.menu-button i').stop().animate({color: colors[bgcIndex]}, 1000);
						if(bgcIndex === 1) $contain.find('.background > p, .title-wrapper > span').css('color', '#4d4d4d');
						else $contain.find('.background > p, .title-wrapper > span').css('color', '');
					}
				});
				$hr('section').scrEffectOfTitle({
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
				$hr('.outline').trigger('deactivate-scroll-effect');
				$hr('section').trigger('deactivate-scroll-effect');

				//이미지 크롭 ////
				$hr('.medium img').extraStyle({ fitted: 'yes' }, 'wait');

				// 의혹 페이지로 이동 ////
				$hr('.outline li').click(function(){
					openPage($(this).attr('data-num'));
				});
				$hr('.go-back-outline').click(function(){
					var num = $(this).parents('section').attr('id').replace(/suspicion\-/, '');
					closePage(num);
				});

				// 네비게이션 동작 ////
				$hr('.navigation .header').click(function(){
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
				$hr('.navigation li').click(function(){
					var pastNum = $(this).parents('.navigation').find('.selected').find('.num').text();
					closeAndOpenPage(pastNum, $(this).find('.num').text());
				});

				//증인 정보 표시 ////
				$hr('.witness-photo').click(function(e) {
					var name = jQuery(this).attr('data-name');
					getWitness(name,jQuery(this));
				});
			}
		});
	});
	function openPage(pageNum){
		$hr('.outline').removeClass('open-inner-page').trigger('deactivate-scroll-effect');
		openAndActivatePage(pageNum);
		unfoldNavi(pageNum);
	}
	function closePage(pageNum){
		$hr('#suspicion-'+pageNum).removeClass('open-inner-page').trigger('deactivate-scroll-effect');
		foldNavi(pageNum);
		$hr('.outline').addClass('open-inner-page').trigger('activate-scroll-effect');
		$hr('.outline .content').trigger('refresh-grid');
	}
	function closeAndOpenPage(pastNum, curNum){
		$hr('#suspicion-'+pastNum).removeClass('open-inner-page').trigger('deactivate-scroll-effect');
		openAndActivatePage(curNum)
		unfoldNavi(curNum);
	}
	function openAndActivatePage(pageNum){
		$hr('#suspicion-'+pageNum).addClass('open-inner-page').trigger('activate-scroll-effect');
		if(!$hr('#suspicion-'+pageNum).hasClass('visited-page')){
			$hr('#suspicion-'+pageNum).addClass('visited-page');
			$hr('#suspicion-'+pageNum+' .medium img').trigger('refresh-style');
		} else {
			$hr('#suspicion-'+pageNum).scrollTop(0);
		}
	}
	function unfoldNavi(pageNum){
		$hr('#suspicion-'+pageNum).find('.navigation').each(function(){
			$(this).find('li').each(function(){
				if($(this).find('.num').text() == pageNum){
					$(this).addClass('selected');
					$(this).parents('.part').removeClass('folded');
					return false;
				}
			});
		});
	}
	function foldNavi(pageNum){
		$hr('#suspicion-'+pageNum).find('.navigation').each(function(){
			$(this).find('.selected').removeClass('selected');
			$(this).find('.part').addClass('folded');
		});
	}
	function htmlOutline(parts, partMap, suspicions){
		var template = _.template($hr('#outline-template').html());
		var tplSuspicions = _.template($hr('#outline-suspicion-template').html());
		var html = '';
		for(var i = 0, leni = parts.length; i < leni; i++){
			var susp = '';
			for(var j = 0, lenj = partMap.length; j < lenj; j++){
				if(partMap[j] == i) susp += tplSuspicions({ num: j+1, item: suspicions[j].title });
			}
			html += template({
				partNum: i + 1,
				title: parts[i].title,
				subtitle: parts[i].sub_title,
				supicions: susp
			});
		}
		return html;
	}
	function htmlNavigation(parts, partMap, suspicions){
		var template = _.template($hr('#navigation-template').html());
		var tplSuspicions = _.template($hr('#nav-suspicion-template').html());
		var html = '';
		for(var i = 0, leni = parts.length; i < leni; i++){
			var susp = '';
			for(var j = 0, lenj = partMap.length; j < lenj; j++){
				if(partMap[j] == i) susp += tplSuspicions({ num: j+1, item: suspicions[j].title });
			}
			html += template({
				title: parts[i].title,
				subtitle: parts[i].sub_title,
				supicions: susp
			});
		}
		return html;
	}
	function makeHtml(sectNum, parts, section, witnesses, partMap, navigation){
		var tplSection = _.template($hr('#section-template').html());
		if(_.isEmpty(section)) return;
		return tplSection({
			section: sectNum + 1,
			partNum: partMap[sectNum] + 1,
			partMainTitle: parts[partMap[sectNum]].title,
			partSubtitle: parts[partMap[sectNum]].sub_title,
			titleNum: sectNum + 1,
			title: section.title,
			bgMediaSize: mediaSize(section.background.media),
			bgMedia: htmlMedia(section.background.media, 'hr'+sectNum+'bg'),
			background: section.background.content,
			witness: htmlWitnesses(section.witnesses, witnesses),
			abstract: paragraphs(section.abstract.content),
			abMediaSize: mediaSize(section.abstract.media),
			abMedia: htmlMedia(section.abstract.media, 'hr'+sectNum+'ab'),
			dialogue: htmlDialogue(section.dialogue, witnesses, 'hr'+sectNum+'da'),
			conclusion: paragraphs(section.conclusion.content),
			concMediaSize: mediaSize(section.conclusion.media),
			concMedia: htmlMedia(section.conclusion.media, 'hr'+sectNum+'md'),
			etcMediaSize: mediaSize(section.etc.media),
			etcMedia: htmlMedia(section.etc.media, 'hr'+sectNum+'et'),
			etcLinkNum: section.etc.content.length,
			etcLinks: htmlEtc(section.etc.content),
			navigation: navigation
		});
	}
	function mediaSize(media){
		if(media.length == 0) return '0';
		else return media.length + (media[0].size == 's=b' ? '-big' : '-small');

	}
	function htmlDialogue(dialogue, witData, gallery){
		var html = '';
		var template = _.template($hr('#dialogue-template').html());
		for(var i = 0, len = dialogue.length; i < len; i++){
			var qna = dialogue[i];
			html += template({
				qName: qna.qName,
				question: paragraphs(qna.qContent),
				qMediaSize: mediaSize(qna.qMedia),
				qMedia: htmlMedia(qna.qMedia, gallery+'q'),
				photo: witData[qna.aName] ? witData[qna.aName].photo : '',
				aName: qna.aName,
				aOrgan: witData[qna.aName] ? witData[qna.aName].organ: '',
				answer: paragraphs(qna.aContent),
				aMediaSize:  mediaSize(qna.aMedia),
				aMedia: htmlMedia(qna.aMedia, gallery+'a')
			});
		}
		return html;
	}
	function htmlEtc(contents){
		if(!contents.length) return '';
		var html = '';
		var template = _.template($hr('#etc-link-tempate').html());
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
		var template = _.template($hr('#witnesses-template').html())
		for(var i = 0, len = witNames.length; i < len; i++){
			var name = witNames[i];
			if(!witData[name]) witData[name] = { organ: '', photo: ''};
			html += template({ name: name, organ: witData[name].organ, photo: witData[name].photo });
		}
		return html;
	}
	function htmlMedia(media, gallery){
		if(!media.length) return '';
		var html = '';
		var template = _.template($hr('#medium-template').html());
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
	}
	function $hr(selector){
		if(selector) return $('#page-hearing').find(selector);
		else return $('#page-hearing');
	}
})(jQuery);

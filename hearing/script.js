(function($){
	$(document).ready(function(){
		var parts;
		var suspicions;
		var witnesses;
		var partMap = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2];
		$.ajax({
			url: 'data/suspicions.json', dataType: 'json',
			success: function(json){ suspicions = json; },
			complete: function(){ $hr().trigger('json-load'); }
		});
		$.ajax({
			url: 'data/parts.json', dataType: 'json',
			success: function(json){ parts = json; },
			complete: function(){ $hr().trigger('json-load'); }
		});
		$.ajax({
			url: 'data/witnesses.json', dataType: 'json',
			success: function(json){ witnesses = json; },
			complete: function(){ $hr().trigger('json-load'); }
		});
		$hr().on('json-load', function(){
			if(parts !== undefined && suspicions !== undefined && witnesses != undefined){
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

				$hr('.se-section').addClass('se-diabled');
				$hr().trigger('ready');
				$(window).resize(function(){ adjustImages(); });
				$hr('.medium img').load(function(){ adjustOneImage($(this)); });

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
						$(this).parents('.navigation').find('.part').addClass('folded');
						$(this).parents('.part').removeClass('folded');
					} else {
						$(this).parents('.part').addClass('folded');
					}
				});
				$hr('.navigation li').click(function(){
					var pastNum = $(this).parents('.navigation').find('.selected').find('.num').text();
					closeAndOpenPage(pastNum, $(this).find('.num').text());
				});
				$hr('.witness-photo').click(function(e) {
					var name = jQuery(this).attr('data-name');
					getWitness(name,jQuery(this));
				});
			}
		});
	});
	function openPage(pageNum){
		$hr('.outline').removeClass('open-inner-page');
		$hr('#suspicion-'+pageNum).addClass('open-inner-page');
		$hr('#suspicion-'+pageNum).find('.se-section').removeClass('se-diabled');
		unfoldNavi(pageNum);
		adjustImages();
		if($hr().scrollTop() > 0) $hr().animate({ scrollTop: 0 }, 500);
	}
	function closePage(pageNum){
		$hr('.outline').addClass('open-inner-page');
		$hr('#suspicion-'+pageNum).removeClass('open-inner-page');
		$hr('#suspicion-'+pageNum).find('.se-section').addClass('se-diabled');
		foldNavi(pageNum);
		if($hr().scrollTop() > 0) $hr().animate({ scrollTop: 0 }, 500);
	}
	function closeAndOpenPage(pastNum, curNum){
		$hr('#suspicion-'+pastNum).removeClass('open-inner-page');
		$hr('#suspicion-'+pastNum).find('.se-section').addClass('se-diabled');
		foldNavi(pastNum);
		$hr('#suspicion-'+curNum).addClass('open-inner-page');
		$hr('#suspicion-'+curNum).find('.se-section').removeClass('se-diabled');
		unfoldNavi(curNum);
		adjustImages();
		if($hr().scrollTop() > 0) $hr().animate({ scrollTop: 0 }, 500);
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
	function adjustImages(){
		$hr('.medium img').each(function(){
			adjustOneImage($(this));
		});
	}
	function adjustOneImage($image){
		var width = $image.width();
		var height = $image.height();
		var wrapWidth = $image.parents('.wrapper').width();
		var wrapHeight = $image.parents('.wrapper').height();
		var ratio = wrapWidth / width;
		if(height * ratio < wrapHeight){
			ratio = wrapHeight / height;
			var nH = height * ratio;
			var nW = width * ratio;
			$image.css({ width: nW+1, height: nH+1 });
			$image.css({ 'margin-left': (wrapWidth-nW)/2, 'margin-top': 0 });
		} else {
			var nH = height * ratio;
			var nW = width * ratio;
			$image.css({ width: nW+1, height: nH+1 });
			$image.css({ 'margin-top': (wrapHeight-nH)/2, 'margin-left': 0 });
		}
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

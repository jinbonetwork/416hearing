(function($){
	$(document).ready(function(){
		var parts;
		var suspicions;
		var witnesses;
		var partMap = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
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
				makeHtml(parts, suspicions, witnesses, partMap);
				/*
				$(window).resize(function(){
					adjustImages();
				});
				$hr('.medium img').load(function(){
					adjustOneImage($(this));
				});
				*/
			}
		});
	});
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
	function makeHtml(parts, sections, witnesses, partMap){
		var tplSection = _.template($hr('#section-template').html());
		//for(var i = 0, leni = sections.length; i < leni; i++){
		for(var i = 11, leni = 12; i < leni; i++){
			var section = sections[i];
			if(_.isEmpty(section)) continue;
			$hr('.sections').append(tplSection({
				section: i + 1,
				partNum: partMap[i] + 1,
				partMainTitle: parts[partMap[i]].title,
				partSubtitle: parts[partMap[i]].sub_title,
				titleNum: i + 1,
				title: section.title,
				bgMediaNum: section.background.length,
				bgMedia: htmlMedia(section.background.media, 'hr'+i+'bg'),
				background: section.background.content,
				witness: htmlWitnesses(section.witnesses, witnesses),
				abstract: paragraphs(section.abstract.content),
				abMediaNum: section.abstract.media.length,
				abMedia: htmlMedia(section.abstract.media, 'hr'+i+'ab'),
				dialogue: htmlDialogue(section.dialogue, witnesses, 'hr'+i+'da'),
				conclusion: paragraphs(section.conclusion.content),
				concMediaNum: section.conclusion.media.length,
				concMedia: htmlMedia(section.conclusion.media, 'hr'+i+'md'),
				etcMediaNum: section.etc.media.length,
				etcMedia: htmlMedia(section.etc.media, 'hr'+i+'et'),
				etcLinks: paragraphs(section.etc.content)
			}));
		}
	}
	function htmlDialogue(dialogue, witData, gallery){
		var html = '';
		var template = _.template($hr('#dialogue-template').html());
		for(var i = 0, len = dialogue.length; i < len; i++){
			var qna = dialogue[i];
			html += template({
				qName: qna.qName,
				question: qna.qContent,
				qMediaNum: qna.qMedia.length,
				qMedia: htmlMedia(qna.qMedia, gallery+'q'),
				photo: witData[qna.aName].photo,
				aName: qna.aName,
				aOrgan: witData[qna.aName].organShort,
				answer: qna.aContent,
				aMediaNum: qna.aMedia.length,
				aMedia: htmlMedia(qna.aMedia, gallery+'a')
			});
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
			html += template({ name: name, organ: witData[name].organShort, photo: witData[name].photo });
		}
		return html;
	}
	function htmlMedia(media, gallery){
		if(!media.length) return '';
		var html = '';
		for(var i = 0, len = media.length; i < len; i++){
			var type;
			if(media[i].url.match(/\.(png|jpg|svg|gif)/)) type = 'image';
			else if(media[i].url.match(/\.(hwp|docx)/)) type = 'doc';
			else type = 'video';
			var template = _.template($('#page-journal').find('#'+type+'-template').html());
			var title = media[i].url.replace(/.+\//g, '');
			html += template({ url: media[i].url, gallery: gallery, title: title });
		}
		return html;
	}
	function $hr(selector){
		if(selector) return $('#page-hearing').find(selector);
		else return $('#page-hearing');
	}
})(jQuery);

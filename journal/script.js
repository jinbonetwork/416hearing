(function($){
	$(document).ready(function(){
		$.ajax({
			url: 'data/journal.json', dataType: 'json',
			success: function(sections){
				makeHtml(sections);
			},
			complete: function(){
				$jn().trigger($.Event('ready'));
				//$('button.menu-button').trigger('click');
				adjustImages();
				adjustVideo();
			}
		});
	});
	function adjustVideo(){
		$jn('.medium iframe.video').each(function(){
			var width = $(this).attr('width');
			var height = $(this).attr('height');
			var wrapWidth = $(this).parent().width();
			var wrapHeight = $(this).parent().height();
			var ratio = wrapWidth / width;
			if(height * ratio < wrapHeight){
				ratio = wrapHeight / height;
				var nH = height * ratio;
				var nW = width * ratio;
				$(this).attr('width', nW);
				$(this).attr('height', nH);
				$(this).css({ 'margin-left': (wrapWidth - nW)/2+'px' });
			} else {
				var nW = width * ratio;
				var nH = height * ratio;
				$(this).attr('width', nW);
				$(this).attr('height', nH);
				$(this).css({ 'margin-top': (wrapHeight - nH)/2+'px' });
			}
		});
	}
	function adjustImages(){
		$jn('.medium img').each(function(){
			$(this).load(function() {
				var width = $(this).width();
				var height = $(this).height();
				var wrapWidth = $(this).parent().width();
				var wrapHeight = $(this).parent().height();
				if(wrapHeight > height) {
					var ratio = wrapHeight / height;
					var nH = height * ratio;
					var nW = width * ratio;
					$(this).css({ width: nW, height: nH});
					$(this).css({ 'margin-left': (wrapWidth-nW)/2+'px' });
				} else {
					var ratio = wrapWidth / width;
					var nH = height * ratio;
					var nW = width * ratio;
					$(this).css({ width: nW, height: nH});
					$(this).css({ 'margin-top': (wrapHeight-nH)/2+'px' });
				}
			});
		});
	}
	function makeHtml(sections){
		var tplSection = _.template($('#section-template').html());
		var tplArticle = _.template($('#article-template').html());
		for(var i = 0, leni = sections.length; i < leni; i++){
			var sectName = sections[i].section;
			var articles = sections[i].data;
			var htmlArticles = '';
			for(var j = 0, lenj = articles.length; j < lenj; j++){
				var article = articles[j];
				htmlArticles += tplArticle({
					level: (article.level ? 'important' : ''),
					date: article.date,
					title: article.title,
					content: article.content,
					nummedia: article.media.length,
					media: htmlMedia(article.media)
				});
			}
			$jn('section:last-of-type').after(tplSection({
				sectname: sectName,
				articles: htmlArticles
			}));
		}
	}
	function htmlMedia(media){
		if(!media.length) return '';
		var html = '';
		for(var i = 0, len = media.length; i < len; i++){
			var template = _.template($('#'+media[i].type+'-template').html());
			html += template({ url: media[i].url });
		}
		return html;
	}
	function $jn(selector){
		if(selector){
			return $('#page-journal').find(selector);
		} else {
			return $('#page-journal');
		}
	}
})(jQuery);

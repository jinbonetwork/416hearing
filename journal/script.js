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
			}
		});
		$(".gallery").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none'
		});
		$(window).resize(function(){
			adjustImages();
		});
		$jn('.medium img').load(function(){
			adjustImages();
		});
	});
	function adjustImages(){
		$jn('.medium img').each(function(){
			var width = $(this).width();
			var height = $(this).height();
			var wrapWidth = $(this).parents('.wrapper').width();
			var wrapHeight = $(this).parents('.wrapper').height();
			var ratio = wrapWidth / width;
			if(height * ratio < wrapHeight){
				var ratio = wrapHeight / height;
				var nH = height * ratio;
				var nW = width * ratio;
				$(this).css({ width: nW, height: nH});
				$(this).css({ 'margin-left': (wrapWidth-nW)/2+'px' });
			} else {
				var nH = height * ratio;
				var nW = width * ratio;
				$(this).css({ width: nW, height: nH});
				$(this).css({ 'margin-top': (wrapHeight-nH)/2+'px' });
			}
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
					media: htmlMedia(article.media, (i+1)*(j+1))
				});
			}
			$jn('section:last-of-type').after(tplSection({
				sectname: sectName,
				articles: htmlArticles
			}));
		}
	}
	function htmlMedia(media, gallery){
		if(!media.length) return '';
		var html = '';
		for(var i = 0, len = media.length; i < len; i++){
			var template = _.template($('#'+media[i].type+'-template').html());
			html += template({ url: media[i].url, gallery: gallery });
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

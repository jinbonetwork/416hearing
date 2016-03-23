(function($){
	$(document).ready(function(){
		$.ajax({
			url: 'data/journal.json', dataType: 'json',
			success: function(sections){
				makeHtml(sections);
			},
			complete: function(){
				$jn().trigger($.Event('ready'));
				adjustImages();
				$(window).resize(function(){
					adjustImages();
				});
				$jn('.medium img').load(function(){
					adjustOneImage($(this));
				});
			}
		});
		$(".gallery").fancybox({
			openEffect	: 'none',
			closeEffect	: 'none'
		});
	});
	function adjustImages(){
		$jn('.medium img').each(function(){
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
			//var title = media[i].url.replace(/https*:\/\/.+\//, '');
			var title = media[i].url.replace(/.+\//g, '');

			html += template({ url: media[i].url, gallery: gallery, title: title });
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

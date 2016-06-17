var _ = require('../contrib/underscore/underscore-min.js');

(function($){
	$(document).ready(function(){
		$.ajax({
			url: 'data/journal.json', dataType: 'json',
			success: function(sections){
				makeHtml(sections);
			},
			complete: function(){
				$jn().scrEffectOfTitle({
					title: '.sect-name',
					position: 'right'
				});
				$jn().scrEffectOfBgcolor({
					background: '#ffffff #ffffff #1a1a1a #f2f2f2 #1a1a1a #dfe5ea',
					section: 'section',
					after: function($contain, bgcolor, bgcIndex){
						var colors = ['#4d4d4d', '#6d92c4', '#0be4db', '#97d5ac', '#ffb0a9', '#7657c5'];
						$('button.menu-button i').stop().animate({'color': colors[bgcIndex]}, 1000);
						$contain.find('article .date').stop().animate({'background-color': bgcolor}, 1000);
					}
				});
				$jn('.medium img').extraStyle({ fitted: 'yes' }, '', 'outerrect');
			}
		});
	});
	function makeHtml(sections){
		var tplSection = _.template($jn('#section-template').html());
		var tplArticle = _.template($jn('#article-template').html());
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
			var template = _.template($jn('#'+media[i].type+'-template').html());
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

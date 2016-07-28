var _ = require('../contrib/underscore/underscore-min.js');
var sJournal;

(function($){

	'use strict';

	function SewolJournal(element,options) {
		this.Root = $( element );

		this.settings = $.extend({}, $.fn.sewoljournal.defaults, options);

		this.pageHandler = jQuery('body').data('handler')

		this.init();
	}

	SewolJournal.prototype = {
		init: function() {
			var self = this;

			$.ajax({
				url: 'data/journal.json',
				dataType: 'json',
				success: function(sections){
					self.makeHtml(sections);
				},
				complete: function(){
					self.initEvent();
				}
			});
		},

		makeHtml: function(sections){
			var self = this;
			var tplSection = _.template(this.Root.find('#section-template').html());
			var tplArticle = _.template(this.Root.find('#article-template').html());
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
						media: self.htmlMedia(article.media, (i+1)*(j+1))
					});
				}
				this.Root.find('section:last-of-type').after(tplSection({
					sectname: sectName,
					articles: htmlArticles
				}));
			}
		},

		htmlMedia: function(media, gallery){
			if(!media.length) return '';
			var html = '';
			for(var i = 0, len = media.length; i < len; i++){
				var template = _.template(this.Root.find('#'+media[i].type+'-template').html());
				var title = media[i].url.replace(/.+\//g, '');
				html += template({ url: media[i].url, gallery: gallery, title: title });
			}
			return html;
		},

		initEvent: function() {
			var self = this;

			this.Root.find('section.title').respStyle({
				breakpoint: '320 1440',
				'padding-top': '30 200 max',
				'padding-bottom': '30 200 max'
			});
			this.Root.find('section.title .maintitle p').respStyle({
				breakpoint: '320 1440',
				'font-size': '3.2 9.6 em max'
			});
			this.Root.find('section.title .subtitle span').respStyle({
				breakpoint: '320 1440',
				'font-size': '1.3 3.9 em max'
			});
			this.Root.find('section:nth-of-type(n+2)').respStyle({
				breakpoint: '560 1440',
				'padding-right': '160 565 max'
			});
			this.Root.find('.sect-name span').respStyle({
				breakpoint: '560 1440',
				width: '128.6 454.15 max',
				'font-size': '25.72 90.83 max'
			});
			this.Root.find('.sect-name').respStyle({
				breakpoint: '560 1440',
				'margin-left': '17.23 60.84 max'
			});
			this.Root.scrEffectOfTitle({
				title: '.sect-name',
				position: 'right',
				section: 'section',
				active: 560,
				option: 'wait'
			});
			this.Root.scrEffectOfBgcolor({
				background: '#ffffff #ffffff #1a1a1a #f2f2f2 #1a1a1a #dfe5ea',
				section: 'section',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#4d4d4d', '#6d92c4', '#0be4db', '#97d5ac', '#ffb0a9', '#7657c5'];
					$('button.menu-button i').stop().animate({'color': colors[bgcIndex]}, 1000);
					$contain.find('article .date').stop().animate({'background-color': bgcolor}, 1000);
					self.changeTextColor(bgcIndex);
				}
			});

			this.Root.find(".gallery").fancybox({ padding: 0 });
			this.Root.find('.medium img').extraStyle({ fitted: 'yes' }, '', 'outerrect');
			//this.Root.find('.medium img').addClass('grayscale grayscale-fade').gray();
		},

		changeTextColor: function(index){
			if(index !== 0){
				var colors = ['#e0e0e0', '#4d4d4d'];
				this.Root.find('section:nth-child('+(index+1)+')').find('.title > span, .content > span').css('color', '');
				this.Root.find('section:nth-child('+index+')').find('.title > span, .content > span').css('color', colors[index%2]);
				this.Root.find('section:nth-child('+(index+2)+')').find('.title > span, .content > span').css('color', colors[index%2]);
			}
		},

		activate: function(){
			this.Root.trigger('activate');
		},

		deactivate: function(){
			this.Root.trigger('deactivate');
		},
	};

	$.fn.sewoljournal = function(options) {
		return this.each(function() {
			var sewoljournal = new SewolJournal($(this), options);
			$.data(this,'handler',sewoljournal);
		});
	};

	$(document).ready(function() {
		sJournal = $('#page-journal').sewoljournal();
	});
})(jQuery);

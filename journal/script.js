var _ = require('../contrib/underscore/underscore-min.js');
var sJournal;

(function($){

	'use strict';

	function SewolJournal(element,options) {
		var self = this;
		this.Root = jQuery( element );

		this.settings = $.extend({}, $.fn.sewoljournal.defaults, options);

		this.Gnavi = jQuery('.pages-stack');

		this.init();
	}

	SewolJournal.prototype = {
		init: function() {
			var self = this;

			jQuery.ajax({
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
				option: 'wait',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#4d4d4d', '#6d92c4', '#0be4db', '#97d5ac', '#ffb0a9', '#7657c5'];
					$('button.menu-button i').stop().animate({'color': colors[bgcIndex]}, 1000);
					$contain.find('article .date').stop().animate({'background-color': bgcolor}, 1000);
					self.changeTextColor(bgcIndex);
				}
			});
			if(!this.Gnavi.hasClass('pages-stack--open')) {
				this._activate();
			} else {
				this.deactivate();
			}
			this.Root.find(".gallery").fancybox({ padding: 0 });
			this.Root.find('.medium img').extraStyle({ fitted: 'yes' }, '', 'outerrect');
		},

		changeTextColor: function(index){
			if(index !== 0){
				var colors = ['#e0e0e0', '#4d4d4d'];
				this.Root.find('section:nth-child('+(index+1)+')').find('.title > span, .content > span').css('color', '');
				this.Root.find('section:nth-child('+index+')').find('.title > span, .content > span').css('color', colors[index%2]);
				this.Root.find('section:nth-child('+(index+2)+')').find('.title > span, .content > span').css('color', colors[index%2]);
			}
		},

		activate: function() {
			var self = this;
			var intv = setInterval(function(){
				if(!self.Gnavi.hasClass('pages-stack--open')){
					clearInterval(intv);
					self._activate();
				}
			}, 200);
		},

		_activate: function() {
			this.Root.trigger('activate-scroll-effect');
		},

		deactivate: function() {
			this.Root.trigger('deactivate-scroll-effect');
		}
	};

	jQuery.fn.sewoljournal = function(options) {
		return this.each(function() {
			var sewoljournal = new SewolJournal(jQuery(this), options);
			jQuery.data(this,'handler',sewoljournal);
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	sJournal = jQuery('#page-journal').sewoljournal();
});

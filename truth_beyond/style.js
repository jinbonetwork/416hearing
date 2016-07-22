/*
목차
	- common
	- section.page-title
	- section.investigate
*/

var SewolTruthBeyond = require('./script.js');
(function($){
	SewolTruthBeyond.prototype.style = function(){
		// common ////
		this.$('section:first-child, section + section, .part + .part').respStyle({
			breakpoint: '320 1920',
			'margin-top': '60 160 max'
		});
		this.$('.image-with-title .title-on-image h6').respStyle({
			breakpoint: '320 1920',
			'font-size': '36 52 max'
		});

		// section.page-title ////
		this.$('.page-title h1').respStyle({
			breakpoint: '320 1920',
			'font-size': '42 72 max'
		});

		// section.investigate ////;
		this.$('.investigate-law--content, .investigate-law--caption').respStyle({
			breakpoint: '320 1920',
			'padding-left': '2 4 em max',
			'padding-right': '2 4 em max'
		});
		this.$('.part.investigate-journal h3').respStyle({
			breakpoint: '320 1920',
			'font-size': '21 36 max'
		});
		this.$('.journal-desktop h6').respStyle({
			breakpoint: '768 1920',
			'font-size': '60 118 max'
		});
		this.$('.journal-desktop').find('.journal-left li, .journal-right li').respStyle({
			breakpoint: '768 1024 1920',
			'font-size': '15 18 = max'
		});
	}
})(jQuery);

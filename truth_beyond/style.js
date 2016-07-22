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
		this.$('section:first-child, section + section, .part + .part, .resp-margin-top').respStyle({
			breakpoint: '320 1920',
			'margin-top': '60 160 max'
		});
		this.$('.image-with-title .title-on-image h6').respStyle({
			breakpoint: '320 1920',
			'font-size': '36 52 max'
		});
		this.$('.image-with-title, .subsection-title-region, .contents-region').respStyle({
			breakpoint: '320 768 1920',
			'padding-left': '24 40 = max',
			'padding-right': '24 40 = max'
		});

		// section.page-title ////
		this.$('.page-title h1').respStyle({
			breakpoint: '320 1920',
			'font-size': '42 72 max'
		});

		// section.investigate ////;
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
		this.$('.investigate-score--title p').respStyle({
			breakpoint: '320 1920',
			'font-size': '20 60 max'
		});
	}
})(jQuery);

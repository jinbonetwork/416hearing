/*
목차
	common
	.image-with-title
	.subsection-title-region
	.contents-region
	.title-on-image
	.blockquote
	.video-wrap
	.media-and-text-in-two-column
	.page-title
	section.investigate
	section.conceal
*/
(function($){
	var SewolTruthBeyond = require('./script.js');
	SewolTruthBeyond.prototype.style = function(){
		// common ////
		this.$el('.part, .resp-margin-top').respStyle({
			breakpoint: '320 1920',
			'margin-top': '60 160 max'
		});
		this.$el('.part:last-child').respStyle({
			breakpoint: '320 1920',
			'margin-bottom': '60 160 max'
		});

		// .image-with-title ////
		this.$el('.image-with-title').respStyle({
			breakpoint: '320 1920',
			'font-size': '36 52 max'
		});
		this.$el('.image-with-title').respStyle({
			breakpoint: '320 768 1920',
			'margin-left': '24 40 = max',
			'margin-right': '24 40 = max'
		});

		// .subsection-title-region ////
		this.$el('.subsection-title-region').respStyle({
			breakpoint: '320 768 1520',
			'padding-left': '24 40 = max',
			'padding-right': '24 40 = max'
		});
		this.$el('.subsection-title-region > h3').respStyle({
			breakpoint: '320 1920',
			'font-size': '21 36 max'
		});

		// .contents-region ////
		this.$el('.contents-region').respStyle({
			breakpoint: '320 768 1920',
			'padding-left': '24 40 = max',
			'padding-right': '24 40 = max'
		});

		//.title-on-image ////
		this.$el('.title-on-image h6').respStyle({
			breakpoint: '320 1920',
			'font-size': '36 52 max'
		});

		// .blockquote ////
		this.$el('.blockquote span').respStyle({
			breakpoint: '320 1920',
			'font-size': '24 46 max'
		});
		this.$el('.blockquote .text-wrap').respStyle({
			breakpoint: '320 1920',
			'padding-left': '15 40 max',
			'padding-right': '15 40 max'
		});
		this.$el('.blockquote i').respStyle({
			breakpoint: '320 1920',
			'font-size': '12 32 max'
		});
		this.$el('.blockquote .caption').respStyle({
			breakpoint: '320 1920',
			'padding-left': '15 40 max'
		});

		// .video-wrap ////
		this.$el('.video-wrap').extraStyle({
			ratio: 9/16
		});

		// .media-and-text-in-two-column ////
		this.$el('.media-and-text-in-two-column .left-column').respStyle({
			breakpoint: '768 1920',
			'padding-right': '12 20 max'
		});
		this.$el('.media-and-text-in-two-column .right-column').respStyle({
			breakpoint: '768 1920',
			'padding-left': '12 20 max'
		});

		// .page-title ////
		this.$el('.page-title h1').respStyle({
			breakpoint: '320 1920',
			'font-size': '42 72 max'
		});

		// section.investigate ////;
		this.$el('.part.investigate-journal h3').respStyle({
			breakpoint: '320 1920',
			'font-size': '21 36 max'
		});
		this.$el('.journal-desktop h6').respStyle({
			breakpoint: '768 1920',
			'font-size': '60 118 max'
		});
		this.$el('.journal-desktop').find('.journal-left li, .journal-right li').respStyle({
			breakpoint: '768 1024 1920',
			'font-size': '15 18 = max'
		});
		this.$el('.investigate-score--title p').respStyle({
			breakpoint: '320 1920',
			'font-size': '20 60 max'
		});

		// section.conceal ////
		this.$el('.part.navy-part-2 .simple-image-wrap').respStyle({
			breakpoint: '768 1920',
			'padding-top': '24 40 max'
		});
	}
})(jQuery);

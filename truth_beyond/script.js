var sTruthBeyond;

(function($){

	//'use strict';

	module.exports = SewolTruthBeyond;

	function SewolTruthBeyond(element,options) {
		this.Root = $(element);
		this.path = {
			root: 'data/truth_beyond/',
			image: 'data/truth_beyond/images/',
			doc: 'data/truth_beyond/docs/',
			video: ''
		}
		this.markup();
		this.style();
		this.adjustment();
		this.events();
	}
	SewolTruthBeyond.prototype.$ = function(selector){
		return ( selector ? this.Root.find(selector) : this.Root );
	}
	SewolTruthBeyond.prototype.markup = function(){
		var self = this;
		self.$('.image-with-title').each(function(){
			self.imageWithTitle($(this));
		});
		self.$('.media-and-text-in-two-column').each(function(){
			self.mediaAndTextInTwoColumn($(this));
		});
		self.markupJournal();
	}
	SewolTruthBeyond.prototype.adjustment = function(){
		self.$('.navy-p1-image-wrap:last-child').fitEnd(self.$('.navy-p1-image-wrap:first-child'), 'bottom');
	}
	SewolTruthBeyond.prototype.events = function(){
		var self = this;

	}
	SewolTruthBeyond.prototype.activate = function(){
		var self = this;

	}
	SewolTruthBeyond.prototype.deactivate = function(){
		var self = this;

	}
	SewolTruthBeyond.prototype.movePageGlobally = function(){
		var self = this;

	}
	SewolTruthBeyond.prototype.imageWithTitle = function($el){
		var self = this;
		var arg = {
			src: $el.attr('data-src'),
			option: $el.attr('data-option'),
			title: $el.attr('data-title'),
			caption: $el.attr('data-caption')
		};
		var markup =
			'<div class="image-wrap">' +
				'<img src="'+self.path.image+arg.src+'">' +
				'<div class="title-on-image"><h6>'+arg.title+'</h6></div>' +
			'</div>' +
			'<div class="caption"><h6>'+arg.caption+'</h6></div>';
		$el.append(markup);
		if(arg.option == 'auto'){
			var $img = $el.find('img');
			$img.load(function(){ self.imageCropAuto($img); });
			$(window).resize(function(){ self.imageCropAuto($img); });
		}
	}
	SewolTruthBeyond.prototype.imageCropAuto = function($image){
		var w = $image.get(0).naturalWidth, h = $image.get(0).naturalHeight;
		var pw = $image.parent().width(), ph = $image.parent().height();
		if(w >= pw || h >= ph){
			if(w/pw < h/ph) $image.css({ width: '100%', height: 'auto' });
			else $image.css({ width: 'auto', height: '100%' });
		}
	}
	SewolTruthBeyond.prototype.markupJournal = function(){
		var self = this;
		var $wrap = self.$('.investigate-journal');
		var $list = $wrap.find('ul.journal-data > li');
		var $desktop = $wrap.find('.journal-desktop');
		var $mobile = $wrap.find('.journal-mobile > ul');
		var $center = $desktop.find('.journal-center > ul');
		var $left = $desktop.find('.journal-left > ul');
		var $right = $desktop.find('.journal-right > ul');

		$desktop.find('p.journal-year').html($list.eq(0).attr('data-year'));
		$desktop.find('p.journal-date').html($list.eq(1).attr('data-date'));
		$desktop.find('p.journal-content').html($list.eq(1).html());
		var preYear = '';
		for(var i = 0, len = $list.length; i < len; i++){
			var $li = $list.eq(i);
			var year = $li.attr('data-year');
			var date = $li.attr('data-date');
			var period = $li.attr('data-period');
			var side = $li.attr('data-side');
			var content = $li.html();

			var liClass;
			if(year) liClass = 'journal-year';
			else if(date) liClass = 'journal-date';
			else liClass = 'journal-period';
			if(i >= 2){
				$center.append('<li class="'+liClass+'"><div>'+(date || year || period)+'</div></li>');
				$left.append('<li class="'+liClass+'">'+(side == 'left' ? content+'<div class="link-line"></div>' : '' )+'</li>');
				$right.append('<li class="'+liClass+'">'+(side == 'right' ? content+'<div class="link-line"></div>' : '' )+'</li>');
			}

			if(year === undefined){
				var sideHtml = '';
				if(side == 'left') sideHtml = '<span>정부주장</span>';
				else if(side == 'right') sideHtml = '<span>특조위주장</span>';
				$mobile.append(
					'<li class="'+side+( preYear ? ' row-with-year' : '' )+'">'+
						(preYear ? '<div class="journal-year">'+preYear+'</div>' : '' ) +
						'<div class="journal-label">'+(date || period)+'</div>'+
						'<div class="journal-item">'+sideHtml+content+'</div>'+
					'</li>'
				);
			}
			preYear = year;
		}
		$wrap.children('ul.journal-data').remove();
	}
	SewolTruthBeyond.prototype.mediaAndTextInTwoColumn = function($el){
		var self = this;
		var arg = {
			type: $el.attr('data-type'),
			src: $el.attr('data-src'),
			option: $el.attr('data-option'),
			link: $el.attr('data-link'),
			caption: $el.attr('data-caption'),
			text: $el.attr('data-text')
		};
		var mkLinkWrap = '<a class="link-wrap" href="'+arg.link+'" target="_blank"><img src="'+self.path.image+arg.src+'"></a>';
		var mkVideoWrap = '';
		var mkMedia =
			'<div class="media-wrap">' +
				( arg.type == 'prezi' ? mkLinkWrap : mkVideoWrap ) +
				'<div class="caption"><h6>'+arg.caption+'</h6></div>' +
			'</div>';
		var mkText = '<div class="text-wrap">'+arg.text+'</div>';
		var markup =
			'<div class="left-column">'+( arg.option == 'left-media' ? mkMedia : mkText )+'</div>' +
			'<div class="right-column">'+( arg.option == 'left-media' ? mkText : mkMedia )+'</div>';
		$el.append(markup);
	}

	$.fn.fitEnd = function($target, which){
		return this.each(function(){
			new FitEnd($(this), $target, which);
		});
	}
	function FitEnd($el, $target, which){
		this.$el = $el;
		this.$target = $target;
		this.which = which;

		this.fitEnd();
		this.events();
	}
	FitEnd.prototype.fitEnd = function(){
		var self = this;
		var oEnd1 = self.$el[0].getBoundingClientRect()[self.which];
		var oEnd2 = self.$target[0].getBoundingClientRect()[self.which];
		var end1, end2;
		var intv = setInterval(function(){
			end1 = self.$el[0].getBoundingClientRect()[self.which];
			end2 = self.$target[0].getBoundingClientRect()[self.which];
			if(oEnd1 === end1 && oEnd2 === end2){
				clearInterval(intv);
				var prop = '';
				switch (self.which){
					case 'top': prop = 'padding-bottom'; break;
					case 'bottom': prop = 'padding-top'; break;
					case 'left': prop = 'padding-right'; break;
					case 'right': prop = 'padding-left'; break;
				}
				self.$el.css(prop, '+='+(end2 - end1));
			} else {
				oEnd2 = end2;
				oEnd1 = end1;
			}
		}, 200);
	}
	FitEnd.prototype.events = function(){
		this.$el.on('refresh', this.fitEnd.bind(this));
		$(window).resize(this.fitEnd.bind(this));
	}

	$.fn.sewolTruthBeyond = function(options) {
		return this.each(function() {
			var sewolTruthBeyond = new SewolTruthBeyond($(this), options);
			$.data(this, 'handler', sewolTruthBeyond);
		});
	};

	$(document).ready(function() {
		sTruthBeyond = $('#page-truth-beyond').sewolTruthBeyond();
	});

})(jQuery);

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
		self.markupJournal();
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

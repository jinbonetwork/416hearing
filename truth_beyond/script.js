(function($){

	//'use strict';

	module.exports = SewolTruthBeyond;
	function SewolTruthBeyond(element,options) {
		this.Root = $(element);
		this.data = require('./data.json.js');
		this.path = {
			root: 'data/truth_beyond/',
			image: 'data/truth_beyond/images/',
			doc: 'data/truth_beyond/docs/',
			video: ''
		}
		this.markup();
		this.style();
		this.markupAfterStyle();
		this.events();
	}
	SewolTruthBeyond.prototype.$el = function(selector){
		return ( selector ? this.Root.find(selector) : this.Root );
	}
	SewolTruthBeyond.prototype.markup = function(){
		for(var prop in this.data){
			var template = this.data[prop].template;
			this[template](prop, this.data[prop], this.$el());
		}
	}
	SewolTruthBeyond.prototype.markupAfterStyle = function(){
		this.$el('.video-wrap').clickAndPlayYoutube();
		this.$el('.navy-p1-image-wrap:last-child').fitEnd(
			this.$el('.navy-p1-image-wrap:first-child'), 'bottom', 768
		);
		this.nisPart1ImgArrange();
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
	SewolTruthBeyond.prototype.plainDiv = function(partname, partdata, $container){
		var markup =
			'<div>' +
				( partdata.title ? '<h6>'+partdata.title+'</h6>' : '' ) +
				( partdata.imgsrc ? '<img src="'+this.path.image+partdata.imgsrc+'">' : '' ) +
				( partdata.text ? '<p>'+partdata.text+'</p>' : '' ) +
			'</div>';
		var $part = $(markup).appendTo($container);
		if(partname) $part.addClass('part '+partname);
		if(partdata.classes) $part.addClass(partdata.classes);
		if(partdata.data){
			if($.type(partdata.data) !== 'string'){
				for(var i = 0, len = partdata.data.length; i < len; i++){
					var data = partdata.data[i];
					if($.type(data) !== 'string'){
						this[data.template]('', data, $part);
					} else {
						$('<div>'+data+'</div>').appendTo($part);
					}
				}
			} else {
				$part.html(partdata.data);
			}
		}
	}
	SewolTruthBeyond.prototype.pageTitle = function(partname, partdata, $container){
		var markup =
			'<div class="part page-title">' +
				'<div><h1>'+partdata.data[0]+'</h1></div>' +
				'<div><h1>'+partdata.data[1]+'</h1></div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.imageWithTitle = function(partname, partdata, $container){
		var self = this;
		var markup =
			'<div class="part image-with-title '+partname+'"">' +
				'<div class="image-wrap">' +
					'<img src="'+self.path.image+partdata.src+'">' +
					'<div class="title-on-image"><h6>'+partdata.title+'</h6></div>' +
				'</div>' +
				( partdata.caption ? '<div class="caption"><h6>'+partdata.caption+'</h6></div>' : '') +
			'</div>';
		var $el = $(markup).appendTo($container);
		if(partdata.option == 'auto'){
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
	SewolTruthBeyond.prototype.investigateLaw = function(partname, partdata, $container){
		var markup =
			'<div class="part investigate-law text-region">' +
				'<div class="investigate-law--wrap">' +
					'<div class="investigate-law--content">' +
						'<h6>'+partdata.title+'</h6>' +
						'<ul>' +
							'<li>'+partdata.data[0]+'</li>' +
							'<li>'+partdata.data[1]+'</li>' +
						'</ul>' +
					'</div>' +
					'<div class="investigate-law--caption">'+partdata.caption+'</div>' +
				'</div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.investigateJournal = function(partname, partdata, $container){
		var self = this;
		var markup =
			'<div class="part investigate-journal">' +
				'<h3>'+partdata.title+'</h3>' +
				'<div class="journal-desktop contents-region">' +
					'<div class="journal-header">' +
						'<p class="journal-year"></p>' +
						'<p class="journal-date"></p>' +
						'<p class="journal-content"></p>' +
					'</div>' +
					'<div class="journal-wrap">' +
						'<div class="journal-left">' +
							'<ul></ul>' +
							'<h6>정<br>부<br>주<br>장</h6>' +
						'</div>' +
						'<div class="journal-right">' +
							'<ul></ul>' +
							'<h6>특<br>조<br>위<br>주<br>장</h6>' +
						'</div>' +
						'<div class="journal-center">' +
							'<ul></ul>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="journal-mobile">' +
					'<ul></ul>' +
				'</div>' +
				'<div class="journal-closing resp-margin-top text-region">'+partdata.closing+'</div>' +
			'</div>';
		var $wrap = $(markup).appendTo($container);
		var $desktop = $wrap.find('.journal-desktop');
		var $mobile = $wrap.find('.journal-mobile > ul');
		var $center = $desktop.find('.journal-center > ul');
		var $left = $desktop.find('.journal-left > ul');
		var $right = $desktop.find('.journal-right > ul');

		$desktop.find('p.journal-year').html(partdata.data[0].year);
		$desktop.find('p.journal-date').html(partdata.data[1].date);
		$desktop.find('p.journal-content').html(partdata.data[1].content);
		var preYear = '';
		for(var i = 0, len = partdata.data.length; i < len; i++){
			var year = partdata.data[i].year;
			var date = partdata.data[i].date;
			var period = partdata.data[i].period;
			var side = partdata.data[i].side;
			var content = partdata.data[i].content;

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
	}
	SewolTruthBeyond.prototype.investigateScore = function(partname, partdata, $container){
		var markup =
			'<div class="part investigate-score">' +
				'<div class="investigate-score--wrap contents-region">' +
					'<div class="investigate-score--title">' +
						'<h6>'+partdata.title+'</h6>' +
						'<p>'+partdata.content+'</p>' +
					'</div>' +
					'<div class="investigate-score--graph">' +
						'<div class="graph"></div>' +
					'</div>' +
				'</div>' +
				'<div class="investigate-score--closing text-region">'+partdata.closing+'</div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.mediaAndTextInTwoColumn = function(partname, partdata, $container){
		var self = this;
		var mkWraps = '';
		if(partdata.type == 'prezi'){
			mkWraps = '<a class="link-wrap" href="'+partdata.link+'" target="_blank"><img src="'+self.path.image+partdata.src+'"></a>';
		} else if(partdata.type == 'video'){
			mkWraps = '<div class="video-wrap" data-youtube-id="'+partdata.src+'"></div>';
		} else if(partdata.type == 'image'){
			mkWraps = '<img src="'+self.path.image+partdata.src+'">';
		} else {
			mkWraps = '<div class="void-wrap"></div>';
		}
		var mkMedia =
			'<div class="media-wrap">' +
				mkWraps +
				(partdata.caption ? '<div class="caption"><h6>'+partdata.caption+'</h6></div>' : '') +
			'</div>';
		var mkText = '<div class="text-wrap">'+partdata.text+'</div>';
		var ratioClass = '';
		switch(partdata.ratio){
			case '2:1': ratioClass = 'ratio21'; break;
			case '1:2': ratioClass = 'ratio12'; break;
		}
		var markup =
			'<div class="part contents-region '+partname+'">' +
				'<div class="media-and-text-in-two-column'+( ratioClass ? ' '+ratioClass : '' )+'">' +
					'<div class="left-column">'+( partdata.option == 'left-media' ? mkMedia : mkText )+'</div>' +
					'<div class="right-column">'+( partdata.option == 'left-media' ? mkText : mkMedia )+'</div>' +
				'</div>' +
			'</div>';
		var $part = $(markup).appendTo($container);
		var $otherMaterial = $('<div class="other-material"></div>').insertAfter($part.find('.text-wrap'));
		if(partdata.type == 'prezi' || partdata.type == 'video'){ if(partdata.data){
			for(var i = 0, len = partdata.data.length; i < len; i++){
				self[partdata.data[i].template]('', partdata.data[i], $otherMaterial);
			}
		}} else { if(partdata.data){
			self[partdata.data[0].template]('', partdata.data[0], $part.find('.void-wrap'));
			for(var i = 1, len = partdata.data.length; i < len; i++){
				self[partdata.data[i].template]('', partdata.data[i], $otherMaterial);
			}
		}}
	}
	SewolTruthBeyond.prototype.simpleImageWrap = function(partname, partdata, $container){
		var self = this;
		var markup =
			'<div class="simple-image-wrap">' +
				'<img src="'+self.path.image+partdata.src+'">' +
				( partdata.caption ? '<div class="caption"><h6>'+partdata.caption+'</h6></div>' : '') +
			'</div>';
		$(markup).appendTo($container);
	};
	SewolTruthBeyond.prototype.subsectionTitleRegion = function(partname, partdata, $container){
		var markup =
			'<div class="part subsection-title-region '+partname+'">' +
				'<h3>'+partdata.title+'</h3>' +
				'<div class="subsection-content"></div>' +
			'</div>';
		var $part = $(markup).appendTo($container);
		var $content = $part.find('.subsection-content');
		for(var i = 0, len = partdata.data.length; i < len; i++){
			this[partdata.data[i].template]('', partdata.data[i], $content);
		}
	}
	SewolTruthBeyond.prototype.navyPart1 = function(partname, partdata, $container){
		var markup =
			'<div class="navy-p1-image-wrap">' +
				'<p>'+partdata.text+'</p>' +
				'<img src="'+this.path.image+partdata.src+'">' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.blockquote = function(partname, partdata, $container){
		var markup =
			'<div class="blockquote">' +
				'<div class="wrap">' +
					'<div class="text-wrap">' +
						'<i class="fa fa-quote-left" aria-hidden="true"></i>' +
						'<span>'+partdata.text+'</span>' +
						'<i class="fa fa-quote-right" aria-hidden="true"></i>' +
					'</div>' +
					'<div class="caption"><h6>'+partdata.caption+'</h6></div>' +
				'</div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.listWithCircleNumber = function(partname, partdata, $container){
		var mkList = '';
		var title, content, note
		for(var i = 0, len = partdata.data.length; i < len; i++){
			title = partdata.data[i].title;
			content = partdata.data[i].content;
			note = partdata.data[i].note;
			mkList += '<li>' +
				'<div class="list-number">'+(i+1)+'</div>' +
				'<h6>'+title+'</h6>' +
				( content ? '<p>'+content+'</p>' : '') +
				( note ? '<div class="list-note">'+note+'</div>' : '') +
			'</li>';
		}
		var markup ='<ol class="list-with-circle-number">'+mkList+'</ol>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.bluehousePart1 = function(partname, partdata, $container){
		var markup =
			'<div class="video-wrap" data-youtube-id="'+partdata.youtube+'"></div>' +
			'<div class="caption">' +
				'<h6>'+partdata.caption+'</h6>' +
				'<button type="button">텍스트로 보기</button>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.suspicionList = function(partname, partdata, $container){
		var mkList = '', data;
		for(var i = 0, len = partdata.data.length; i < len; i++){
			data = partdata.data[i];
			mkList += '<li>' +
				'<div class="number"><span>의혹</span><span>'+data.number+'</span></div>' +
				'<div class="title" data-href="'+data.href+'"><span>'+data.title+'</span></div>' +
			'</li>';
		}
		var markup =
			'<div class="part '+partname+' suspicion-list '+partdata.page+'">' +
				'<div class="list-wrap">' +
					'<div class="list-title"><h6>'+partdata.title+'</h6></div>' +
					'<ul>'+mkList+'</ul>' +
				'</div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.nisPart1 = function(partname, partdata, $container){
		var markup = '';
		for(var i = 0, len = partdata.data.length; i < len; i++){
			markup += '<img src="'+this.path.image+partdata.data[i]+'">';
		}
		markup = '<div class="image-wrap">'+markup+'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.lawRevisionTable = function(partname, partdata, $container){
		var mkData = '';
		for(var i = 0, leni = partdata.data.length; i < leni; i++){
			var data = partdata.data[i], mkList = '';
			for(var j = 0, lenj = data.list.length; j < lenj; j++){
				mkList += '<li>' +
					'<div class="lrvt-bill">' +
						'<a href="'+this.path.doc+data.list[j].material+'" target="_blank">'+data.list[j].bill+'</a>' +
					'</div>' +
					'<div class="lrvt-date">'+data.list[j].date+'</div>' +
				'</li>';
			}
			mkData += '<li>' +
				'<div class="lrvt-title">'+data.title+'</div>' +
				'<div class="lrvt-list-wrap">' +
					'<ul class="lrvt-list">'+mkList+'</ul><div class="lrvt-explain">'+data.explain+'</div>' +
				'</div>' +
			'</li>';
		}
		var markup = '<div class="part law-revision-table contents-region"><ul class="lrvt-wrap">'+mkData+'</ul></div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.twoImagesWithCpation = function(partname, partdata, $container){
		var markup =
		 	'<div class="part two-images-with-caption">' +
				'<div class="image-wrap"><img src="'+this.path.image+partdata.src[0]+'"></div>' +
				'<div class="image-wrap"><img src="'+this.path.image+partdata.src[1]+'"></div>' +
				'<div class="text-region"><div class="caption"><h6>'+partdata.caption+'</h6></div></div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.nisPart1ImgArrange = function(){
		var self = this;
		var a, y, x, r = 20;
		self.$el('.nis-part-1 img').each(function(index){
			a = (2*Math.PI / 7 * index);
			x = r*Math.sin(a) + 50;
			y = r*Math.cos(a) + 50;
			$(this).css({ left: x+'%', top: y+'%' });
		});
	}

	$.fn.sewolTruthBeyond = function(options) {
		return this.each(function() {
			var sewolTruthBeyond = new SewolTruthBeyond($(this), options);
			$.data(this, 'handler', sewolTruthBeyond);
		});
	};

	$(document).ready(function() {
		$('#page-truth-beyond').sewolTruthBeyond();
	});
})(jQuery);

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

		this.pageHandler = jQuery('body').data('handler');

		this.markup();
		this.style();
		this.markupAfterStyle();
		this.events();
		this.scrollAnimation();
	}
	SewolTruthBeyond.prototype.$el = function(selector){
		return ( selector ? this.Root.find(selector) : this.Root );
	}
	SewolTruthBeyond.prototype.markup = function(){
		var self = this;
		for(var prop in this.data){
			var template = this.data[prop].template;
			this[template](prop, this.data[prop], this.$el());
		}
		var myLazyload = new LazyLoad({
			elements_selector: "img.lazyload",
			container: self.$el().get(0),
			callback_load: function(image) {
				var $image = $(image);
				if($image.hasClass('auto')) {
					$image.load(function(){ self.imageCropAuto($image); });
					$(window).resize(function(){
						if($image.is(':visible')) self.imageCropAuto($image);
					})
				}
			}
		});
	}
	SewolTruthBeyond.prototype.markupAfterStyle = function(){
		var self = this;
		self.$el('.video-wrap').addClass('activatable').clickAndPlayYoutube(this.$el(), false);
		self.$el('.navy-p1-image-wrap:last-child img').load(function(){
			self.$el('.navy-p1-image-wrap:last-child').fitEnd(
				self.$el('.navy-p1-image-wrap:first-child'), 'bottom', 768
			);
		});
		self.nisPart1ImgArrange();
		self.conclusionMapEffect();
		self.mediaAndTextInTwoColumnStyle();
	}
	SewolTruthBeyond.prototype.events = function(){
		var self = this;

		new WOW({
			scrollContainer: '#'+this.$el().attr('id')
		}).init();
;
		self.$el('.related-material ol.list-with-circle-number li').mouseenter(function(e) {
			jQuery(this).find('p').slideDown();
		});
		self.$el('.related-material ol.list-with-circle-number li').mouseleave(function(e) {
			jQuery(this).find('p').slideUp();
		});
		self.$el('.suspicion-list [data-href] > span').click(function(){
			self.movePageGlobally(this);
		});

		self.$el().find('.graph .progress').circles({
			showProgress: 1,
			targetPos: 211,
			scale: 212,
			speed: 1,
			container: self.Root,
			onFinishMoving:function(pos){
			}
		});

		self.$el().find('.overlay-link').overlay_link({
			button: '.overlay-button',
			container: self.$el(),
		});
	}
	SewolTruthBeyond.prototype.activate = function(){
		$('button.menu-button i').stop().animate({ 'color': '#4d4d4d'}, 1000);
		this.$el('.activatable').trigger('activate');
	}
	SewolTruthBeyond.prototype.deactivate = function(){
	}
	SewolTruthBeyond.prototype.movePageGlobally = function(elem){
		var l = jQuery(elem).parent();
		var _sl = l.attr('data-href');
		var sl = _sl.split("-");
		switch(parseInt(sl[0])) {
			case 1:
				this.pageHandler.changePage('page-hearing', (sl.length > 1 ? parseInt(sl[1]) : 0) );
				var subhandler = jQuery('#page-hearing').data('handler');;
				var f = subhandler.getCurrent();
				subhandler.movePage(f, (sl.length > 1 ? parseInt(sl[1]) : 0), false);
				break;
			case 2:
				this.pageHandler.changePage('page-2nd-hearing', (sl.length > 1 ? parseInt(sl[1]) : 0) );
				var subhandler = jQuery('#page-2nd-hearing').data('handler');;
				var f = subhandler.getCurrent();
				subhandler.movePage(f, (sl.length > 1 ? parseInt(sl[1]) : 0), false);
				break;
			default:
				break;
		}
	}
	SewolTruthBeyond.prototype.plainDiv = function(partname, partdata, $container){
		var markup =
			'<div>' +
				( partdata.title ? '<h6>'+partdata.title+'</h6>' : '' ) +
				( partdata.imgsrc ? '<img data-original="'+this.path.image+partdata.imgsrc+'" class="lazyload">' : '' ) +
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
				'<div class="title-1"><h1>'+partdata.data[0]+'</h1></div>' +
				'<div class="title-2"><h1>'+partdata.data[1]+'</h1></div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.imageWithTitle = function(partname, partdata, $container){
		var self = this;
		var markup =
			'<div class="part image-with-title '+partname+'"">' +
				'<div class="image-wrap">' +
					'<img data-original="'+self.path.image+partdata.src+'" class="lazyload'+(partdata.option == 'auto' ? ' auto' : '')+'">' +
					'<div class="title-on-image"><h6>'+partdata.title+'</h6></div>' +
				'</div>' +
				( partdata.caption ? '<div class="caption"><h6>'+partdata.caption+'</h6></div>' : '') +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.imageCropAuto = function($image){
		$image.css('width', '').css('height', '');
		var w = $image.width(), h = $image.height();
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
						'<div class="graph">' +
							'<div class="progress"></div>' +
						'</div>' +
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
			mkWraps =
				'<a class="link-wrap" href="'+partdata.link+'" target="_blank">' +
					'<div class="link-icon"><i class="fa fa-link"></i><i class="fa fa-circle-thin"></i></div>' +
					'<img data-original="'+self.path.image+partdata.src+'" class="lazyload">' +
				'</a>';
		} else if(partdata.type == 'video'){
			mkWraps = '<div class="video-wrap" data-youtube-id="'+partdata.src+'"></div>';
		} else if(partdata.type == 'image'){
			mkWraps = '<img data-original="'+self.path.image+partdata.src+'" class="lazyload">';
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
	SewolTruthBeyond.prototype.mediaAndTextInTwoColumnStyle = function(){
		var self = this;
		iconSize();
		$(window).resize(iconSize);
		function iconSize(){
			self.$el('.media-and-text-in-two-column .link-wrap').each(function(){
				var $wrap = $(this);
				var w = $wrap.outerWidth();
				$wrap.find('i').each(function(index){
					$(this).css('font-size', 0.14*w*(index+1));
				});
			});
		}
	}
	SewolTruthBeyond.prototype.simpleImageWrap = function(partname, partdata, $container){
		var self = this;
		var markup =
			'<div class="simple-image-wrap">' +
				'<img data-original="'+self.path.image+partdata.src+'" class="lazyload">' +
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
				'<img data-original="'+this.path.image+partdata.src+'" class="lazyload">' +
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
				'<div class="overlay-link url">' +
					'<a href="data/truth_beyond/docs/recorded.html" class="overlay-button" data-subject="[전문] 이정현 전 청와대 홍보수석의 KBS 세월호 보도 개입 녹취록">텍스트로 보기</a>' +
				'</div>' +
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
			markup += '<div class="image-container"><img data-original="'+this.path.image+partdata.data[i]+'" class="lazyload" width="100%"></div>';
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
		 	'<div class="part '+partname+' two-images-with-caption">' +
				'<div class="image-wrap"><img data-original="'+this.path.image+partdata.src[0]+'" class="lazyload"></div>' +
				'<div class="image-wrap"><img data-original="'+this.path.image+partdata.src[1]+'" class="lazyload"></div>' +
				'<div class="text-region"><div class="caption"><h6>'+partdata.caption+'</h6></div></div>' +
			'</div>';
		$(markup).appendTo($container);
	}
	SewolTruthBeyond.prototype.nisPart1ImgArrange = function(){
		var self = this;
		var a, y, x, r = 20;
		self.$el('.nis-part-1 .image-container').each(function(index){
			a = (2*Math.PI / 7 * index);
			x = r*Math.sin(a) + 50;
			y = r*Math.cos(a) + 50;
			$(this).css({ left: x+'%', top: y+'%' });
		});
		self.$el('.nis-part-1 img').each(function(index){
			$(this).addClass('wow');
			$(this).addClass('bounceInUp');
			$(this).attr('data-wow-delay', (0.2 + (1 * index))+'s');
		});
	}

	SewolTruthBeyond.prototype.scrollAnimation = function(){
		var self = this;
		var elements = [
			'.part.page-title > .title-1',
			'.part.page-title > .title-2',
			'.part.investigate-title',
			'.part.investigate-law',
			'.part.investigate-journal > h3',
			'.part.investigate-journal .journal-header',
			'.part.investigate-journal .journal-left',
			'.part.investigate-journal .journal-right',
			'.part.investigate-journal .journal-center',
			'.part.investigate-journal .journal-closing',
			'.investigate-score--title',
			'.investigate-score--graph',
			'.investigate-score--closing',
			'.part.prezi-suspicoins .left-column',
			'.part.prezi-suspicoins .right-column',
			'.part.conceal-title',
			'.navy-part-1 h3',
			'.navy-p1-image-wrap:first-child',
			'.navy-p1-image-wrap:last-child',
			'.navy-part-2 .left-column',
			'.navy-part-2 .right-column',
			'.navy-part-2 .other-material .simple-image-wrap',
			'.navy-part-3',
			'.navy-part-4 .left-column',
			'.navy-part-4 .right-column',
			'.navy-part-5',
			'.bluehouse-part-1 h3',
			'.bluehouse-part-1 .subsection-content',
			'.bluehouse-part-2 .left-column',
			'.bluehouse-part-2 .right-column',
			'.bluehouse-part-3',
			'.bluehouse-part-4',
			'.bluehouse-part-5 .left-column',
			'.bluehouse-part-5 .right-column',
			'.bluehouse-part-6',
			'.bluehouse-part-7 .left-column',
			'.bluehouse-part-7 .right-column',
			'.nis-part-1 h3',
			'.nis-part-1 .subsection-content',
			'.nis-part-2',
			'.nis-part-3',
			'.nis-part-4',
			'.special-prosecutor-part-1 h3',
			'.special-prosecutor-part-1 .subsection-content',
			'.special-prosecutor-part-2 > div:first-child',
			'.special-prosecutor-part-2 > div:last-child',
			'.law-revision-table ul > li:nth-child(1)',
			'.law-revision-table ul > li:nth-child(2)',
			'.law-revision-table ul > li:nth-child(3)',
			'.salvage-part-1',
			'.salvage-part-2 .left-column',
			'.salvage-part-2 .right-column .text-wrap',
			'.salvage-part-2 .right-column .simple-image-wrap:first-child',
			'.salvage-part-2 .right-column .simple-image-wrap:last-child',
			'.salvage-part-3 .image-wrap:nth-child(1)',
			'.salvage-part-3 .image-wrap:nth-child(2)',
			'.salvage-part-3 .text-region',
			'.salvage-part-4',
			'.salvage-part-5',
			'.salvage-part-6 .left-column',
			'.salvage-part-6 .right-column',
			'.salvage-part-7 .image-wrap:nth-child(1)',
			'.salvage-part-7 .image-wrap:nth-child(2)',
			'.salvage-part-7 .text-region',
			'.salvage-part-8 img',
			'.salvage-part-8 p'
		];
		self.$el(elements.join()).addClass('wow fadeInUp');

		if(window.innerWidth >= 768){
			self.scrAniDelay(elements, '.part.investigate-journal .journal-left', 3);
			self.scrAniDelay(elements, '.investigate-score--title', 2);
			self.scrAniDelay(elements, '.part.prezi-suspicoins .left-column', 2);
			self.scrAniDelay(elements, '.navy-part-1 h3', 3);
			self.scrAniDelay(elements, '.navy-part-2 .left-column', 3);
			self.scrAniDelay(elements, '.navy-part-4 .left-column', 2);
			self.scrAniDelay(elements, '.bluehouse-part-1 h3', 2);
			self.scrAniDelay(elements, '.bluehouse-part-2 .left-column', 2);
			self.scrAniDelay(elements, '.bluehouse-part-5 .left-column', 2);
			self.scrAniDelay(elements, '.bluehouse-part-7 .left-column', 2);
			self.scrAniDelay(elements, '.nis-part-1 h3', 2);
			self.scrAniDelay(elements, '.special-prosecutor-part-1 h3', 2);
			self.scrAniDelay(elements, '.special-prosecutor-part-2 > div:first-child', 2);
			self.scrAniDelay(elements, '.law-revision-table li:nth-child(1)', 2);
			self.scrAniDelay(elements, '.salvage-part-2 .left-column', 4);
			self.scrAniDelay(elements, '.salvage-part-3 .image-wrap:nth-child(1)', 3);
			self.scrAniDelay(elements, '.salvage-part-6 .left-column', 2);
			self.scrAniDelay(elements, '.salvage-part-7 .image-wrap:nth-child(1)', 3);
			self.scrAniDelay(elements, '.salvage-part-8 img', 2);
			self.$el('.navy-part-1 h3, .bluehouse-part-1 h3, .nis-part-1 h3, .special-prosecutor-part-1 h3').removeClass('fadeInUp').addClass('slideInLeft');
		} else {
			self.$el('.journal-mobile > ul > li').addClass('wow fadeInUp');
		}

		delay = 0;
		var newDelay, oldDelay;
		for(var i = 0, len = elements.length; i < len; i++){
			var $el = self.$el(elements[i]);
			if($el.offset().top < $(window).height()){
				delay += 0.5;
				oldDelay = $el.attr('data-wow-delay');
				if(oldDelay){
					newDelay = parseFloat(oldDelay) + delay;
				} else {
					newDelay = delay;
				}
				$el.attr('data-wow-delay',  newDelay+'s');
			}
		}
	}
	SewolTruthBeyond.prototype.scrAniDelay = function(elements, el, count, interval){
		interval = ( interval ? inteval : 0.5);
		var startIndex = 0;
		for(var i = 0, len = elements.length; i < len; i++){
			if(el == elements[i]){
				startIndex = i; break;
			}
		}
		for(var i = 0; i < count; i++){
			this.$el(elements[startIndex + i]).attr('data-wow-delay', (interval*i)+'s');
		}
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

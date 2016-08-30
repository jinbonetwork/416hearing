var _ = require('../../contrib/underscore/underscore-min.js');
var sHearingLive;

(function($) {
	'use strict';

	function SewolHearingLive(element,options) {
		this.Root = $( element );

		this.settings = $.extend({}, $.fn.sewolhearinglive.defaults, options);

		this.live = this.Root.find('section.live.se-section');
		this.opinion = this.Root.find('section.opinion.se-section');
		this.completeInit = false;
		this.init();
	}

	SewolHearingLive.prototype = {
		init: function() {
			var self = this;
			self.Root.scrEffectOfBgcolor({
				background: '#ffffff #ffffff #dfe5ea #1a1a1a #1a1a1a',
				section: 'section'
			});

			this.initLive();
			this.initOpinion();
			this.go_opinion(1, false);
		},

		initLive: function() {
			var self = this;

			var url = "./data/live/live.html";

			jQuery.ajax({
				url: url,
				method: 'GET',
				dataType: 'html',
				success: function(html) {
					self.live.find('#live-content').html(html);
					self.completeInit = true;
					if(self.Root.hasClass('is-admin')) {
						self.initEdit();
					}
				},
				error: function( jqXHR, textStatus, errorThrown ) {
					console.log(jqXHR.responseText);
				}
			});
		},

		initOpinion: function() {
			var self = this;
			this.opinion.find('form#opinion-form').submit(function(e){
				var TheForm = this;
				if(TheForm.memo.value == '') {
					self.opinion.find('#opinion-memo-alert-box').show().text('질문내용을 입력하세요');
					TheForm.memo.focus();
					return false;
				} else {
					self.opinion.find('#opinion-memo-alert-box').hide().text('');
				}
				var url = TheForm.action;
				var params = 'mode=add&memo='+TheForm.memo.value;

				jQuery.ajax({
					url: url,
					method: 'POST',
					data: params,
					dataType: 'json',
					success: function(json) {
						var errors = parseInt(json.error);
						if(errors == 1) {
							jQuery('#opinion-memo-alert-box').show().text(json.message);
							TheForm.memo.focus();
						} else if(errors == 2) {
							jQuery('#opinion-memo-alert-box').show().text(json.message);
						} else if(errors == 0) {
							jQuery('#opinion-memo-alert-box').hide().text('');
							jQuery('#opinion-items-wrap').replaceWith( self.opinion_make(json) );
							TheForm.memo.value = '';
						}
					},
					complete: function() {
						self.opinion_init_click_event();
					},
					error: function( jqXHR, textStatus, errorThrown ) {
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});

				return false;
			});
		},

		go_opinion: function(page, scroll) {
			var self = this;

			var url = this.opinion.find('form#opinion-form').attr('action') + '?page=' + page;

			jQuery.ajax({
				url: url,
				method: 'GET',
				dataType: 'json',
				success: function(data) {
					if(parseInt(data.error)) {
						alert(data.message);
					} else {
						jQuery('#opinion-items-wrap').replaceWith( self.opinion_make(data) );
					}
				},
				complete: function() {
					if(scroll){
						var wrapOffset = jQuery('#opinion-items-wrap').offset();
						var scrTop = jQuery('#page-3rd-hearing').scrollTop();
						jQuery('#page-3rd-hearing').animate({ scrollTop: scrTop + wrapOffset.top }, 400);
					}

					self.opinion_init_click_event();
				},
				error: function( jqXHR, textStatus, errorThrown ) {
					console.log(errorThrown);
				}
			});
		},

		opinion_init_click_event: function() {
			var self = this;
			this.opinion.find('#opinion-nav li').each(function(idx) {
				var li = jQuery(this);
				if( li.hasClass('active') ) {
					li.bind('click',function(e) {
						self.go_opinion( li.attr('data-id'), true );
					});
				} else {
					li.unbind('click');
				}
			});
			if(this.completeInit !== true) this.completeInit = true;
		},

		opinion_make: function(json) {
			if(!json.total_cnt) return '';

			var tplopinionitems = _.template($('#opinion-items-template').html());
			var tplopinionitem = _.template($('#opinion-item-template').html());
			var tplopinionnav = _.template($('#opinion-nav-template').html());

			var itemsMarkup  = '';
			for(var i = 0; i < json.opinions.length; i++ ) {
				var d = new Date(parseInt(json.opinions[i].regdate) * 1000);
				d = d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
				itemsMarkup += tplopinionitem({
					id: json.opinions[i].id,
					memo: json.opinions[i].memo,
					regdate: d
				});
			}

			var navMarkup = tplopinionnav({
				classname: (json.nav.p_page ? 'active' : 'deactive'),
				id: json.nav.p_page,
				label: '이전'
			});
			for(var p = json.nav.s_page; p <= json.nav.e_page; p++) {
				navMarkup += tplopinionnav({
					classname: (json.page == p ? 'current' : 'active'),
					id: p,
					label: p
				});
			}
			navMarkup += tplopinionnav({
				classname: (json.nav.n_page ? 'active' : 'deactive'),
				id: json.nav.n_page,
				label: '다음'
			});

			var htmlMarkup = tplopinionitems({
				page: json.page,
				total_page: json.total_page,
				items: itemsMarkup,
				navi: navMarkup
			});

			return htmlMarkup;
		},

		initEdit: function() {
			var self = this;
			if(this.live.find('.editor').length > 0) {
				this.live.find('.editor').attr('contenteditable',"true");
				CKEDITOR.disableAutoInline = true;
				CKEDITOR.inline( 'live-content' );

				var bt = jQuery('<button type="button">저장하기</button>');
				bt.click(function(e) {
					self.live_save();
				});
				this.live.append(bt);

				jQuery(document).keydown(function(event) {
					var code = event.charCode || event.keyCode;
					if(code == 83 && (event.ctrlKey || event.altKey)) {
						event.preventDefault();
						self.live_save();
					}
				});
			}
		},

		live_save: function() {
			var self = this;
			var params = 'mode=save&content='+encodeURIComponent(jQuery('.page.is-admin .live>.editor').html());
			var url = location.href.replace(/\/edit(\/)?$/,'')+'/3rd_hearing/live/live.php';

			jQuery.ajax({
				url: url,
				data: params,
				dataType: 'json',
				method: 'POST',
				beforeSend: function() {
					self.loading();
				},
				success: function(data) {
					self.removeloading();
					if(parseInt( data.error ) == 0) {
					} else {
						console.log(data.message);
					}
				},
				error: function( jqXHR, textStatus, errorThrown ) {
					console.log(jqXHR.responseText);
				}
			});
		},

		loading: function() {
			jQuery('body').append(jQuery('<div class="saving"><div class="saving-background"></div><div class="is-loading"><i class="fa fa-spinner fa-pulse"></i></div></div>'));
			jQuery('.saving .is-loading').css({
				'left' : parseInt( ( jQuery(window).width() - 100 ) / 2 ),
				'top' : parseInt( ( jQuery(window).height() - 100 ) / 2 )
			});
		},

		removeloading: function() {
			jQuery('body .saving').remove();
		},

		activate: function() {
			var self = this;
			if(self.completeInit) activate();
			else {
				var intv = setInterval(function(){
					if(self.completeInit){
						activate(); clearInterval(intv);
					}
				}, 100);
			}
			function activate(){
				self.Root.trigger('activate');
			}
		},

		deactivate: function(){
			this.Root.trigger('deactivate');
		},
	};

	$.fn.sewolhearinglive = function(options) {
		return this.each(function() {
			var sewolhearinglive = new SewolHearingLive($(this), options);
			$.data(this,'handler',sewolhearinglive);
		});
	};

	$(document).ready(function() {
		sHearingLive = $('#page-3rd-hearing').sewolhearinglive();
	});
})(jQuery);

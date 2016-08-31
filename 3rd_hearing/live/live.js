var _ = require('../../contrib/underscore/underscore-min.js');
var sHearingLive;

(function($) {
	'use strict';

	function SewolHearingLive(element,options) {
		this.Root = $( element );

		this.settings = $.extend({}, $.fn.sewolhearinglive.defaults, options);

		this.live = this.Root.find('section.live.se-section');
		this.completeInit = false;
		this.init();
	}

	SewolHearingLive.prototype = {
		init: function() {
			var self = this;

			self.Root.scrEffectOfTitle({
				title: '.sect-name',
				position: 'left',
				section: 'section',
				active: 560,
				option: 'wait'
			});
			self.Root.scrEffectOfBgcolor({
				background: '#ffffff #ffffff #1a1a1a #dfe5ea',
				section: 'section',
				after: function($contain, bgcolor, bgcIndex){
					var colors = ['#4d4d4d', '#4d4d4d', '#ffffff', '#4d4d4d'];
					$('button.menu-button i').stop().animate({'color': colors[bgcIndex]}, 1000);

					for(var i = 0; i < 4; i++){
						var $allElem = self.Root.find('section').eq(i).children().eq(2).find('*');
						if(i === bgcIndex) {
							$allElem.css('color', '');
						} else {
							$allElem.css('color', colors[bgcIndex]);
						}
					}
				}
			});

			this.initLive();
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

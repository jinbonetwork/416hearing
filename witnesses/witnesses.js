var _ = require('../contrib/underscore/underscore-min.js');
(function ($) {

	'use strict';

	function SewolWitnesses(element,options) {
		var self = this;

		this.settings = $.extend({}, $.fn.sewolwitnesses.defaults, options);

		this.Root = jQuery(element);
		this.template_loaded = false;

		this.Root.find('img').click(function(e) {
			var name = jQuery(this).attr('data-name');
			self.get(name);
		});
	}

	SewolWitnesses.prototype = {
		make: function(name,json) {
			if(this.template_loaded === false) {
				this.witnessesTpl = _.template(jQuery('#witnesses-summary-template').html());
				this.witnessesProfileTpl = _.template(jQuery('#witnesses-summary-profile-template').html());
				this.witnessesSusTpl = _.template(jQuery('#witnesses-summary-suspicions-template').html());
				this.witnessesSusItemTpl = _.template(jQuery('#witnesses-summary-suspicion-item-template').html());
				this.witnessesCardTpl = _.template(jQuery('#witnesses-summary-card-template').html());
				this.witnessesCardItemTpl = _.template(jQuery('#witnesses-summary-card-item-template').html());
				this.witnessesTimelineTpl = _.template(jQuery('#witnesses-summary-timeline-template').html());
				this.witnessesTimelineItemTpl = _.template(jQuery('#witnesses-summary-timeline-item-template').html());
				this.template_loaded = true;
			}

			var position = "";
			if(typeof json.position !== 'undefined' && json.position.length > 0) {
				for(var i=0; i<json.position.length; i++) {
					position += (i ? ", " : "") + json.position[i];
				}
			}
			var photo = '';
			var photoExistClass = 'hidden';
			if(typeof json.photo !== 'undefined' && json.photo) {
				var photoExistClass = '';
				var photo = json.photo;
			}
			var description = '';
			if(typeof json.descript !== 'undefined' && json.descript) {
				description = json.descript;
			}
	
			var profile_markup = "";
			profile_markup = this.witnessesProfileTpl({
				photo: photo,
				photoExistClass: photoExistClass,
				name: name,
				positions: position,
				description: description
			});
	
			var suspicions_markup = "";
			if(typeof json.suspicions !== 'undefined' && json.suspicions.length > 0) {
				var suspicions_item_markup = "";
				for(var i=0; i<json.suspicions.length; i++) {
					suspicions_item_markup += this.witnessesSusItemTpl({
						page: json.suspicions[i].page,
						index: json.suspicions[i].id,
						subject: json.suspicions[i].title
					});
				}
				suspicions_markup = this.witnessesSusTpl({
					suspicions: suspicions_item_markup
				});
			}
			var card_markup = '';
			if(typeof json.card !== 'undefined' && json.card.length > 0) {
				var card_item_markup = '';
				for(var i=0; i<json.card.length; i++) {
					card_item_markup += this.witnessesCardItemTpl({
						card: '<img src="'+json.card[i]+'">'
					});
				}
				card_markup = this.witnessesCardTpl({
					cardlist: card_item_markup
				});
			}
		
			var timeline_markup = '';
			if(typeof json.timeline !== 'undefined' && json.timeline.length > 0) {
				var timeline_item_markup = '';
				for(var i=0; i<json.timeline.length; i++) {
					timeline_item_markup += this.witnessesTimelineItemTpl({
						time: json.timeline[i].time,
						content: json.timeline[i].content
					});
				}
				timeline_markup = this.witnessesTimelineTpl({
					timeline: timeline_item_markup
				});
			}
	
			var markup = this.witnessesTpl({
				profile: profile_markup,
				suspicions: suspicions_markup,
				cards: card_markup,
				timeline: timeline_markup
			});
	
			return markup;
		},

		get: function(name) {
			var self = this;
			var url = "./witnesses/api.php";
			var params = { name: name };

			jQuery.ajax({
				url: url,
				data: params,
				dataType: 'json',
				method: 'GET',
				success: function(json) {
					var markup = self.make(name,json);
					var Obj = jQuery('<div class="witness-container">'+markup+'<div class="witness-container-background"></div></div>');
					jQuery('.witness-summary-wrapper').remove();
					jQuery('body').append(Obj);
				},
				complete: function() {
					var Obj = jQuery('.witness-container');
					if(jQuery(window).width() >= 1680) {
						var pos = self.Root.offset();
						var w = ( parseInt( ( jQuery(window).width() - 680 ) / 2 ) - 15 );
						var t = (pos.top - 10);
						h = Math.min( 700, ( jQuery(window).height() - t ) );
						if( h < 500) {
							h = 500;
							t = ( jQuery(window).height() - h );
						}
						Obj.find('.witness-summary').css({
							'left': 0,
							'top': t + 'px',
							'width':  w + 'px',
							'height': h + 'px'
						});
						var n_h = 0;
						Obj.find('.witness-summary-box').children().each(function() {
							n_h += parseInt(jQuery(this).outerHeight());
						});
						if(n_h < h) {
							var t = (pos.top - 10);
							if( t > ( jQuery(window).height() - n_h ) )
								t = ( jQuery(window).height() - n_h );
							Obj.find('.witness-summary').css({
								'top': t + 'px',
								'height': n_h + 'px'
							});
							Obj.find('.witness-summary-box').addClass('no-scroll');
						}
						Obj.find('.witness-container-background').hide();
					} else {
						var w = Math.min( 550, ( jQuery(window).width() - 20 ) );
						var h = Math.min( 700, ( jQuery(window).height() - 20 ) );
						Obj.find('.witness-summary').css({
							'left': parseInt( ( jQuery(window).width() - w ) / 2 ),
							'top': parseInt( ( jQuery(window).height() - h ) / 2 ),
							'width' : w + 'px',
							'height' : h + 'px'
						});
					}
					Obj.find('.pgwSlideshow').pgwSlideshow();
					self.container = Obj;
					self.container.keydown(function(event) {
						var code = event.charCode || event.keyCode;
						if(code == 27) {
							self.close();
						}
					});
					Obj.find('i.fa-close, .witness-container-background').click(function(e) {
						self.close();
					});
					Obj.find('.witness-suspicions dd.witness-suspicion-data').click(function(e) {
						var page = parseInt( jQuery(this).attr('data-page') );
						var id = jQuery(this).attr('data-id');
						self.close();
						self.goPage(page,id);
					});
				},
				error: function( jqXHR, textStatus, errorThrown ) {
					console.log(jqXHR.responseText);
				}
			});
		},

		close: function() {
			this.container.remove();
		},

		goPage: function(page,id) {
			switch(page) {
				case 1:
					var preId = jQuery('#page-hearing .navigation').find('.selected').first().find('.num').text();
					jQuery('#page-hearing #suspicion-'+preId+' .navigation li').each(function(){
						if(jQuery(this).find('.num').text() == id){ jQuery(this).click(); return false; }
					})
					break;
				case 2:
					var preId = jQuery('#page-2nd-hearing .sections .inner-page.open-inner-page').attr('id').replace(/suspicion\-/i,"");
					if(id != preId) {
						console.log(this.settings.component);
						this.settings.component.closePage(preId);
						this.settings.component.openPage(id);
					}
					break;
			}
		}
	};

	jQuery.fn.sewolwitnesses = function(options) {
		return this.each(function() {
			var sewolwitnesses = new SewolWitnesses(jQuery(this), options);
		});
	};

})(jQuery);

var _ = require('../contrib/underscore/underscore-min.js');

function makeWitness(name,json) {
	var witnessesTpl = _.template(jQuery('#witnesses-summary-template').html());
	var witnessesProfileTpl = _.template(jQuery('#witnesses-summary-profile-template').html());
	var witnessesSusTpl = _.template(jQuery('#witnesses-summary-suspicions-template').html());
	var witnessesSusItemTpl = _.template(jQuery('#witnesses-summary-suspicion-item-template').html());
	var witnessesCardTpl = _.template(jQuery('#witnesses-summary-card-template').html());
	var witnessesCardItemTpl = _.template(jQuery('#witnesses-summary-card-item-template').html());
	var witnessesTimelineTpl = _.template(jQuery('#witnesses-summary-timeline-template').html());
	var witnessesTimelineItemTpl = _.template(jQuery('#witnesses-summary-timeline-item-template').html());

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
		var photo = 'data/2nd_hearing/images/'+json.photo;
	}
	var description = '';
	if(typeof json.descript !== 'undefined' && json.descript) {
		description = json.descript;
	}

	var profile_markup = "";
	profile_markup = witnessesProfileTpl({
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
			suspicions_item_markup += witnessesSusItemTpl({
				index: json.suspicions[i].id,
				subject: json.suspicions[i].title
			});
		}
		suspicions_markup = witnessesSusTpl({
			suspicions: suspicions_item_markup
		});
	}
	var card_markup = '';
	if(typeof json.card !== 'undefined' && json.card.length > 0) {
		var card_item_markup = '';
		for(var i=0; i<json.card.length; i++) {
			card_item_markup += witnessesCardItemTpl({
				card: '<img src="'+json.card[i]+'">'
			});
		}
		card_markup = witnessesCardTpl({
			cardlist: card_item_markup
		});
	}

	var timeline_markup = '';
	if(typeof json.timeline !== 'undefined' && json.timeline.length > 0) {
		var timeline_item_markup = '';
		for(var i=0; i<json.timeline.length; i++) {
			timeline_item_markup += witnessesTimelineItemTpl({
				time: json.timeline[i].time,
				content: json.timeline[i].content
			});
		}
		timeline_markup = witnessesTimelineTpl({
			timeline: timeline_item_markup
		});
	}

	var markup = witnessesTpl({
		profile: profile_markup,
		suspicions: suspicions_markup,
		cards: card_markup,
		timeline: timeline_markup
	});

	return markup;
}

function getWitness(name,element) {
	var url = "./2nd-hearing/witnesses.php";
	var params = { name: name };

	jQuery.ajax({
		url: url,
		data: params,
		dataType: 'json',
		method: 'GET',
		success: function(json) {
			jQuery('.witness-container').remove();
			var markup = makeWitness(name,json);
			var Obj = jQuery('<div class="witness-container">'+markup+'<div class="witness-container-background"></div></div>');
			jQuery('.witness-summary-wrapper').remove();
			jQuery('body').append(Obj);
		},
		complete: function() {
			var Obj = jQuery('.witness-container');
			if(jQuery(window).width() >= 1680) {
				var pos = element.offset();
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
			Obj.keydown(function(event) {
				var code = event.charCode || event.keyCode;
				if(code == 27) {
					jQuery(this).remove();
				}
			});
			Obj.find('i.fa-close').click(function(e) {
				jQuery(this).parents('.witness-container').remove();
			});
			Obj.find('.witness-container-background').click(function(e) {
				jQuery(this).parents('.witness-container').remove();
			});
			Obj.find('.witness-suspicions dd.witness-suspicion-data').click(function(e) {
				var id = jQuery(this).attr('data-id');
				var preId = jQuery('#page-2nd-hearing .sections .inner-page.open-inner-page').attr('id').replace(/suspicion\-/i,"");
				if(id != preId) {
					jQuery(this).parents('.witness-container').find('i.fa-close').click();
					jQuery('#page-2nd-hearing #suspicion-'+preId).removeClass('open-inner-page').trigger('deactivate-scroll-effect');
					jQuery('#page-2nd-hearing .outline').addClass('open-inner-page').trigger('activate-scroll-effect');
					jQuery('#page-2nd-hearing .outline .content').trigger('refresh-grid');
					jQuery('#page-2nd-hearing .outline .video-wrap').trigger('refresh-style');
					if( jQuery('#page-2nd-hearing .outline').find('.refresh').length > 0 )
						jQuery('#page-2nd-hearing .outline').find('.refresh').trigger('refresh');
					jQuery('#page-2nd-hearing .outline li[data-num="'+id+'"]').click();
				}
			});
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			console.log(jqXHR.responseText);
		}
	});
}

module.exports = getWitness;

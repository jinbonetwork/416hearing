	function makeWitness(name,json) {
		console.log(name);
		var witnessesTpl = _.template($('#witnesses-summary-template').html());
		var witnessesProfileTpl = _.template($('#witnesses-summary-profile-template').html());
		var witnessesSusTpl = _.template($('#witnesses-summary-suspicions-template').html());
		var witnessesSusItemTpl = _.template($('#witnesses-summary-suspicion-item-template').html());
		var witnessesTimelineTpl = _.template($('#witnesses-summary-timeline-template').html());
		var witnessesTimelineItemTpl = _.template($('#witnesses-summary-timeline-item-template').html());

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
			timeline: timeline_markup
		});

		return markup;
	}

	function getWitness(name,element) {
		var url = "./hearing/witnesses.php";
		var params = 'name='+name;

		jQuery.ajax({
			url: url,
			data: params,
			dataType: 'json',
			method: 'GET',
			success: function(json) {
				markup = makeWitness(name,json);
				var Obj = jQuery('<div class="witness-container">'+markup+'<div class="witness-container-background"></div></div>');
				jQuery('.witness-summary-wrapper').remove();
				jQuery('body').append(Obj);
			},
			complete: function() {
				var Obj = jQuery('.witness-container');
				if(jQuery(window).width() >= 1680) {
					var pos = element.offset();
					Obj.find('.witness-summary').css({
						'left': 0,
						'top': (pos.top - 10) + 'px',
						'width':  ( parseInt( ( jQuery(window).width() - 680 ) / 2 ) - 15 ) + 'px',
						'height': '700px'
					});
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
				});
			},
			error( jqXHR, textStatus, errorThrown ) {
				console.log(jqXHR.responseText);
			}
		});
	}

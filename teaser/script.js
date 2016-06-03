var _ = require('../contrib/underscore/underscore-min.js');

$('form#opinion-form').submit(function(){
	var TheForm = this;
	if(TheForm.memo.value == '') {
		jQuery('#opinion-memo-alert-box').show().text('질문내용을 입력하세요');
		TheForm.memo.focus();
		return false;
	} else {
		jQuery('#opinion-memo-alert-box').hide().text('');
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
				jQuery('#opinion-items-wrap').replaceWith( opinion_make(json) );
				TheForm.memo.value = '';
			}
		},
		complete: function() {
			opinion_init_click_event();
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	return false;
});

function go_opinion(page, scroll) {
	var url = jQuery('form#opinion-form').attr('action') + '?page=' + page;

	jQuery.ajax({
		url: url,
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			if(parseInt(data.error)) {
				alert(data.message);
			} else {
				jQuery('#opinion-items-wrap').replaceWith( opinion_make(data) );
			}
		},
		complete: function() {
			if(scroll){
				var wrapOffset = jQuery('#opinion-items-wrap').offset();
				var scrTop = jQuery('#page-teaser').scrollTop();
				jQuery('#page-teaser').animate({ scrollTop: scrTop + wrapOffset.top }, 400);
			}

			opinion_init_click_event();
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			console.log(errorThrown);
		}
	});
}

function opinion_init_click_event() {
	jQuery('#opinion-nav li').each(function(idx) {
		var li = jQuery(this);
		if( li.hasClass('active') ) {
			li.bind('click',function(e) {
				go_opinion( li.attr('data-id'), true );
			});
		} else {
			li.unbind('click');
		}
	});
}

function opinion_make(json) {
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
}

function live_save() {
	var params = 'mode=save&content='+encodeURIComponent(jQuery('.page.is-admin .live>.editor').html());
	var url = location.href.replace(/\/edit(\/)?$/,'')+'/teaser/live.php';

	jQuery.ajax({
		url: url,
		data: params,
		dataType: 'json',
		method: 'POST',
		beforeSend: function() {
			loading();
		},
		success: function(data) {
			removeloading();
			if(parseInt( data.error ) == 0) {
			} else {
				console.log(data.message);
			}
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			console.log(jqXHR.responseText);
		}
	});
}

function loading() {
	jQuery('body').append(jQuery('<div class="saving"><div class="saving-background"></div><div class="is-loading"><i class="fa fa-spinner fa-pulse"></i></div></div>'));
	jQuery('.saving .is-loading').css({
		'left' : parseInt( ( jQuery(window).width() - 100 ) / 2 ),
		'top' : parseInt( ( jQuery(window).height() - 100 ) / 2 )
	});
}
function removeloading() {
	jQuery('body .saving').remove();
}

(function($){
	$(document).ready(function(){
		go_opinion(1, false);
		$('#page-teaser').trigger($.Event('ready'));

		if( jQuery('.page.is-admin .live>.editor').length > 0 ) {
			jQuery('.page.is-admin .live>.editor').attr('contenteditable',"true");
			CKEDITOR.disableAutoInline = true;
			CKEDITOR.inline( 'live-content' );

			var bt = jQuery('<button type="button">저장하기</button>');
			bt.click(function(e) {
				live_save();
			});
			jQuery('.page .live').append(bt);

			jQuery(document).keydown(function(event) {
				var code = event.charCode || event.keyCode;
				if(code == 83 && (event.ctrlKey || event.altKey)) {
					event.preventDefault();
					live_save();
				}
			});
		}
	});
})(jQuery);

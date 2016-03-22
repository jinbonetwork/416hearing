(function($){
	$(document).ready(function(){
		go_opinion(1);
		$('#page-teaser').trigger($.Event('ready'));
	});

	function check_opinion_submit(TheForm) {
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
			error( jqXHR, textStatus, errorThrown ) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});

		return false;
	}

	function go_opinion(page) {
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
				opinion_init_click_event();
			},
			error( jqXHR, textStatus, errorThrown ) {
				console.log(errorThrown);
			}
		});
	}

	function opinion_init_click_event() {
		jQuery('#opinion-nav li').each(function(idx) {
			var li = jQuery(this);
			if( li.hasClass('active') ) {
				li.bind('click',function(e) {
					go_opinion( li.attr('data-id') );
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
			var d = new Date(parseInt(json.opinions[i].regdate) * 1000).toGMTString();
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
})(jQuery);

function check_opinion_submit(TheForm) {
	if(TheForm.memo.value == '') {
		jQuery('#opinion-memo-alert-box').show().text('질문내용을 입력하세요');
	} else {
		jQuery('#opinion-memo-alert-box').hide().text('');
	}
	var url = TheForm.action;
	var params = 'memo='+TheForm.memo.value;

	jQuery.ajax({
		url: url,
		method: 'POST',
		data: params,
		dataType: 'json',
		success: function(data) {
			if(parseInt(data.error)) {
				jQuery('#opinion-memo-alert-box').show().text(data.message);
			} else {
				jQuery('#opinion-memo-alert-box').hide().text('');
				jQuery('#opinion-items-wrap').replaceWith(data.message);
			}
		}
	});

	return false;
}

function go_opinion(uri,page) {
	var url = uri+'?page='+page;

	jQuery.ajax({
		url: url,
		method: 'GET',
		dataType: 'json',
		success: function(data) {
			if(parseInt(data.error)) {
				alert(data.message);
			} else {
				jQuery('#opinion-items-wrap').replaceWith(data.message);
			}
		}
	});
}
